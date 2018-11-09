const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')
const upload = require('../middleware/upload-image')


router.get('/', ProductsController.getProducts)

router.post(
    '/',
    checkAuth,
    upload.single('productImage'),
    ProductsController.addProduct
)

router.get('/:productId', ProductsController.getProductById)

router.patch('/:productId', checkAuth, ProductsController.updateProduct)

router.delete('/:productId', checkAuth, ProductsController.deleteProductById)

module.exports = router
