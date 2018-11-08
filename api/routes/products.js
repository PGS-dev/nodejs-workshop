const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET requests to /products',
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Product was created',
    })
})

router.get('/:productId', (req, res, next) => {
    const { productId: id } = req.params
    res.status(200).json({
        message: 'Product details',
        id
    })
})

router.patch('/:productId', (req, res, next) => {
    const { productId: id } = req.params
    res.status(200).json({
        message: 'Updated product',
        id
    })
})

router.delete('/:productId', (req, res, next) => {
    const { productId: id } = req.params
    res.status(200).json({
        message: 'Deleted product',
        id
    })
})

module.exports = router
