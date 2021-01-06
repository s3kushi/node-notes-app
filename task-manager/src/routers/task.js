const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params

    try {
        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
        
    } catch (e) {
        res.status(500).send(e)
    }

})

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params
    const { body } = req
    const updates = Object.keys(body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(property => allowedUpdates.includes(property))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }
    
    try {
        const task = await Task.findByIdAndUpdate(taskId, body, { new: true, runValidators: true })
        
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/delete/:taskId', async (req, res) => {
    const { taskId } = req.params

    try {
        const task = await Task.findByIdAndDelete(taskId)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router