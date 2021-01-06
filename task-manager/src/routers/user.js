const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
    
})

router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params
    const { body } = req
    const updates = Object.keys(body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(property => allowedUpdates.includes(property))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }
    
    try {
        const user = await User.findByIdAndUpdate(userId, body, { new: true, runValidators: true })
        
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/delete/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const user = await User.findByIdAndDelete(userId)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router