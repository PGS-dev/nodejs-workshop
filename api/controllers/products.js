const Product = require('../models/products')

exports.getProducts = async (req, res, next) => {
    try {
        let products = await Product.find().exec()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

exports.addProduct = async (req, res, next) => {
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
}

exports.getProductById = async (req, res, next) => {
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
}

exports.updateProduct = (req, res, next) => {
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
}

exports.deleteProductById = (req, res, next) => {
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
}
