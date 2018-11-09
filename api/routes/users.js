const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')

router.get('/', UsersController.getUsers)

router.post('/singup', UsersController.signup)

router.get('/:userId', UsersController.getUserById)

router.delete('/:userId', UsersController.deleteUserById)

router.post('/login', UsersController.login)

module.exports = router
