const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    testUser1,
    testUser2,
    testTask1,
    populateDatabase
} = require('./fixtures/db')

beforeEach(populateDatabase)

test('user task creation', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send({
            description: 'Test task'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull() // task successfully saved to database
    expect(task.completed).toBe(false)
})

test('user task fetch', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('delete other user task', async () => {
    const response = await request(app)
        .delete(`/tasks/${testTask1._id}`)
        .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(testTask1._id)
    expect(task).not.toBeNull()
})