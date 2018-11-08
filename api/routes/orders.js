const express = require('express')
const router = express.Router()
const Order = require('../models/orders')
const Product = require('../models/products')
const User = require('../models/users')

router.get('/', async (req, res, next) => {
    try {
        let orders = await Order.find().exec()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.post('/', async (req, res, next) => {
    try {
        let user = await User.findById(req.body.userId).exec()
        let product = await Product.findById(req.body.productId).exec()
        if (user && product) {
            let order = new Order({
                userId: user._id,
                productId: product._id
            })
            await order.save()
            res.status(201).json({
                message: 'Order was created'
            })
        } else {
            res.status(404).json({
                message: 'Product or User was not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.get('/:orderId', async (req, res, next) => {
    const { orderId: id } = req.params
    try {
        let order = await Order.findById(id)
            .select('_id userId productId status creationDate')
            .exec()
        if (order) {
            res.status(200).json(order)
        } else {
            res.status(404).json({
                message: 'Order with this id was not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.delete('/:orderId', (req, res, next) => {
    const { orderId: id } = req.params
    Order.deleteOne({ _id: id }, error => {
        if (!error) {
            res.status(200).json({
                message: 'Order was deleted'
            })
        } else {
            res.status(500).json({
                error
            })
        }
    })
})

module.exports = router
