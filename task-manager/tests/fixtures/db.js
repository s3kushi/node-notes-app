const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testUser1Id = new mongoose.Types.ObjectId()
const testUser1 = {
    _id: testUser1Id,
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    password: 'Pass123!',
    tokens: [{
        token: jwt.sign({ _id: testUser1Id }, process.env.JWT_SECRET)
    }]
}

const testUser2Id = new mongoose.Types.ObjectId()
const testUser2 = {
    _id: testUser2Id,
    name: 'Foo Bar',
    email: 'foobar@example.com',
    password: 'Pass321!',
    tokens: [{
        token: jwt.sign({ _id: testUser2Id }, process.env.JWT_SECRET)
    }]
}

const testTask1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 1',
    completed: false,
    owner: testUser1._id
}

const testTask2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 2',
    completed: true,
    owner: testUser1._id
}

const testTask3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task 3',
    completed: true,
    owner: testUser2._id
}

const populateDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUser1).save()
    await new User(testUser2).save()
    await new Task(testTask1).save()
    await new Task(testTask2).save()
    await new Task(testTask3).save()
}

module.exports = {
    testUser1,
    testUser2,
    testUser1Id,
    testUser2Id,
    testTask1,
    testTask2,
    testTask3,
    populateDatabase
}