const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

// Routes
const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const usersRoutes = require('./api/routes/users')

// logger and body parser
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).json({})
    }
    next()
})

app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/users', usersRoutes)

// handling 404 status error response
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

// hadling 500 status errors response
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message,
        },
    })
})

module.exports = app
