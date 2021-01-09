const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { testUser1, testUser1Id, populateDatabase } = require('./fixtures/db')

beforeEach(populateDatabase)

test('user signup', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'John Smith',
            email: 'johnsmith@example.com',
            password: 'MyPass777!'
        })
        .expect(201)

    const body = response.body
    const user = await User.findById(body.user._id)
    expect(user).not.toBeNull() // user successfully saved to database

    // user saved to database with the correct data
    expect(body).toMatchObject({
        user: {
            name: 'John Smith',
            email: 'johnsmith@example.com'
        },
        token: user.tokens[0].token
    })

    // user plain password is not being stored
    expect(user.password).not.toBe('MyPass777!')
})

test('user login', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: testUser1.email,
            password: testUser1.password
        })
        .expect(200)

    const user = await User.findById(testUser1Id)
    // verify that the new token was created and stored
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('nonexistent user login', async () => {
    await request(app).post('/users/login').send({
        email: testUser1.email,
        password: 'failpass'
    })
    .expect(400)
})

test('get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('get user profile unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('delete profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(testUser1)
    expect(user).toBeNull() // verufy that the user was deleted from the database
})

test('delete profile unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('avatar upload', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.png')
        .expect(200)

    const user = await User.findById(testUser1)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('upload valid user fields', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send({
            name: 'New Name'
        })
        .expect(200)

    const user = await User.findById(testUser1)
    expect(user.name).toBe('New Name') // user successfully updated in database
})

test('upload invalid user fields', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send({
            someField: 0
        })
        .expect(400)
})