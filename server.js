const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')

const mimeTypesAllowed = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
]

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: async (req, file, cb) => {
    console.log(file.mimetype)
    console.log(!mimeTypesAllowed.includes(file.mimetype))
    if (!mimeTypesAllowed.includes(file.mimetype)) {
      return cb(new Error('File type not allowed', false))
    }
    cb(null, true)
  },
})
const port = 3000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.post(
  '/send',
  upload.single('file'),
  (req, res) => {
    const formData = req.file
    const bodyData = req.body
    console.log('form data', formData)
    console.log('bodyData', bodyData)
    res.send({ success: true })
  },
  (error, req, res, next) => {
    if (error) {
      res.status(415).json({ success: false, message: error.message })
    } else {
      next()
    }
  }
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
