const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/users/me', async (req, res) => {
    res.send(req.user)
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/users/me', auth, async (req, res) => {
    const { user } = req
    const { body } = req
    const updates = Object.keys(body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(property => allowedUpdates.includes(property))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    updates.forEach(update => user[update] = body[update])

    try {
        await user.save()
        
        // bypasses mongoose middleware 
        // const user = await User.findByIdAndUpdate(userId, body, { new: true, runValidators: true })

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    const { user } = req
    try {
        await user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    const { body } = req
    try {
        const user = await User.findByCredentials(body.email, body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }

})

router.post('/users/logout', auth, async (req, res) => {
    const { user } = req
    const tokens = user.tokens
    try {
        tokens = tokens.filter(token => token.token !== req.token)

        await user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    const { user } = req
    try {
        user.tokens = []

        await user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router