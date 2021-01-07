const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks', auth, async (req, res) => {
    const { user } = req
    try {
        // const tasks = await Task.find({ owner: req.user._id })
        await user.populate('tasks').execPopulate()
        res.send(user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:taskId', auth, async (req, res) => {
    const { taskId } = req.params

    try {
        const task = await Task.findOne({ _id: taskId, owner: req.user._id })//await Task.findById(taskId)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
        
    } catch (e) {
        res.status(500).send(e)
    }

})

router.post('/tasks', async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/tasks/:taskId', auth, async (req, res) => {
    const { taskId } = req.params
    const { body, user } = req
    const updates = Object.keys(body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(property => allowedUpdates.includes(property))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }
    
    try {
        const task = await Task.findOne({ _id: taskId, owner: user._id })
        // bypasses mongoose middleware 
        // const task = await Task.findByIdAndUpdate(taskId, body, { new: true, runValidators: true })
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/delete/:taskId', auth, async (req, res) => {
    const { taskId } = req.params

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router