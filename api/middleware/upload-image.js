const multer = require('multer')

// disk storage strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
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
module.exports = multer({
    storage,
    limits: { filesize: 1024 * 1025 * 5 },
    fileFilter
})
