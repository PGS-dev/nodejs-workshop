const express = require('express')
const router = express.Router()
const Product = require('../models/products')
const multer = require('multer')

// disk storage strategy
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// filter by image mimetype
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(new Error('File has wrong format. It should be in jpeg format'))
    }
}

// init middleware configuration
const upload = multer({
    storage,
    limits: { filesize: 1024 * 1025 * 5 },
    fileFilter
})

router.get('/', async (req, res, next) => {
    try {
        let products = await Product.find().exec()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.post('/', upload.single('productImage'), async (req, res, next) => {
    let imgPath = req.file ? req.file.path : null
    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        imgPath
    })

    try {
        await product.save()
        res.status(201).json({
            message: 'Product was created'
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.get('/:productId', async (req, res, next) => {
    const { productId: id } = req.params

    try {
        let product = await Product.findById(id)
            .select('__id name price isAvailable imgPath')
            .exec()
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({
                message: 'Product with this id not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    const { productId: id } = req.params
    const updateOptions = req.body

    Product.updateOne({ _id: id }, { $set: updateOptions }, error => {
        if (error) {
            res.status(500).json({
                error
            })
        } else {
            res.status(200).json({
                message: 'Product was updated'
            })
        }
    })
})

router.delete('/:productId', (req, res, next) => {
    const { productId: id } = req.params
    Product.deleteOne({ _id: id }, error => {
        if (!error) {
            res.status(200).json({
                message: 'Product was deleted'
            })
        } else {
            res.status(500).json({
                error
            })
        }
    })
})

module.exports = router
