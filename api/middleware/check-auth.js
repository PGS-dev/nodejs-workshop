const jwt = require('jsonwebtoken')
const config = require('../../config/db')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, config.secret)
        next()
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        })
    }
}
