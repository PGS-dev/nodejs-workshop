const express = require('express')
const router = express.Router()
const User = require('../models/users')

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find().exec()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.post('/', async (req, res, next) => {
    let user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email
    })

    try {
        await user.save()
        res.status(201).json({
            message: 'User was created',
            user
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.get('/:userId', async (req, res, next) => {
    const { userId: id } = req.params
    try {
        let user = await User.findById(id)
            .select('__id name lastname email')
            .exec()
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({
                message: 'User with this id doesnt found'
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.delete('/:userId', (req, res, next) => {
    const { userId: id } = req.params
    User.deleteOne({ _id: id }, error => {
        if (!error) {
            res.status(200).json({
                message: 'User was deleted'
            })
        } else {
            res.status(500).json({
                error
            })
        }
    })
})

module.exports = router
