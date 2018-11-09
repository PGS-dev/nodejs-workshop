const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/db')

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().exec()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

exports.getUserById = async (req, res, next) => {
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
}

exports.signup = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email }).exec()
        if (user) {
            res.status(409).json({
                message: 'Mail exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, async (error, hash) => {
                if (error) {
                    res.status(500).json({
                        error
                    })
                } else {
                    let user = new User({
                        name: req.body.name,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash
                    })
                    await user.save()
                    res.status(201).json({
                        message: 'User was created',
                        user
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email }).exec()
        if (user) {
            bcrypt.compare(
                req.body.password,
                user.password,
                (error, result) => {
                    if (error) res.status(401).json({ message: 'Auth failed' })
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id
                            },
                            config.secret,
                            { expiresIn: '1h' }
                        )
                        res.status(200).json({
                            message: 'Auth successful',
                            token
                        })
                    }
                    res.status(401).json({ message: 'Auth failed' })
                }
            )
        } else {
            res.status(401).json({
                message: 'Auth failed'
            })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.deleteUserById = (req, res, next) => {
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
}
