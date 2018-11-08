const express = require('express')
const app = express()

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const usersRoutes = require('./api/routes/users')

app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/users', usersRoutes)

module.exports = app
