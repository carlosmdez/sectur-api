const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const { faker } = require('@faker-js/faker')

// TODO: Add zip file support
const mimeTypesAllowed = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
]

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4()
    const extension = path.extname(file.originalname)
    // Guardar en la BD el nombre, userId y requestId
    cb(null, uniqueName + extension)
  },
})

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: async (req, file, cb) => {
    if (!mimeTypesAllowed.includes(file.mimetype)) {
      return cb(new Error('File type not allowed', false))
    }
    cb(null, true)
  },
  storage,
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
  '/requests/documents',
  upload.single('file'),
  (req, res) => {
    const formData = req.file
    const bodyData = req.body
    console.log('form data', formData)
    console.log('bodyData', bodyData)
    res.send({
      success: true,
      fileId: uuidv4(), // file ID falso simulando la base de datos.
      fileName: 'myPhoto.jpg',
    })
  },
  (error, req, res, next) => {
    if (error) {
      res.status(415).json({ success: false, message: error.message })
    } else {
      next()
    }
  }
)

app.delete('/requests/documents/:documentId', (req, res) => {
  const documentId = req.params.documentId
  if (!documentId || !isValidDocumentId(documentId)) {
    res.status(400).send({
      success: false,
      message: `Invalid documentId: ${documentId}`,
    })
  } else {
    res.send({
      success: true,
      message: `The document with ID ${documentId} has been deleted`,
    })
  }
})

app.get('/api/registro/cat_docs/:catId', (req, res) => {
  const documents = [
    {
      id: 111,
      nombre: 'Formato firmado',
      nombre_completo:
        'Formato firmado por el propietario o representante legal',
      descripcion:
        'Formato único para los trámites del Registro Nacional de Turismo',
      id_tipo_pst: 18,
    },
    {
      id: 112,
      nombre: 'RFC',
      nombre_completo:
        'Registro Federal de Contribuyentes RFC (persona física y persona moral)',
      descripcion:
        'Documento que acredita la actividad lícita del prestador de servicios turísticos',
      id_tipo_pst: 18,
    },
    {
      id: 113,
      nombre: 'Identificacion oficial',
      nombre_completo: 'Identificación oficial del promovente',
      descripcion:
        'Credencial de elector (INE), cédula profesional o pasaporte del propietario o representante legal',
      id_tipo_pst: 18,
    },
    {
      id: 114,
      nombre: 'Acta constitutiva',
      nombre_completo:
        'Acta Constitutiva (personas morales); persona físca deberá adjuntar RFC',
      descripcion: 'Documento que acredita la legal constitución de la empresa',
      id_tipo_pst: 18,
    },
    {
      id: 115,
      nombre: 'Escritura publica',
      nombre_completo:
        'Escritura pública del inmueble, contrato de arrendamiento, o en su caso, contrato de comodato',
      descripcion:
        'Documento que acredita la legal posesión o uso del inmueble donde realiza la actividad',
      id_tipo_pst: 18,
    },
    {
      id: 116,
      nombre: 'Comprobante domicilio',
      nombre_completo: 'Comprobante de domicilio',
      descripcion:
        'Recibo de agua, luz, predial, etc., del domicilio donde realiza la actividad',
      id_tipo_pst: 18,
    },
    {
      id: 117,
      nombre: 'Certificao aeronavegabilidad',
      nombre_completo: 'Certificado de aeronavegabilidad (emitido por SCT)',
      descripcion:
        'Documento que acredita la autorización para desarrollar la prestación del servicio',
      id_tipo_pst: 18,
    },
    {
      id: 118,
      nombre: 'Permiso de vuelo',
      nombre_completo: 'Permiso de vuelo panorámico (emitido por SCT)',
      descripcion:
        'Documento que acredita la autorización para desarrollar la prestación del servicio',
      id_tipo_pst: 18,
    },
  ]

  const modifiedDocuments = documents.map(document => {
    const documentId = faker.string.uuid()
    const documentName = faker.system.commonFileName('jpg')
    return {
      ...document,
      documentId,
      documentName,
    }
  })

  res.send({
    result: {
      data: modifiedDocuments,
      msg: 'Consulta exitosa',
    },
    success: true,
    error: null,
  })
})

app.get('/api/registro/photos/:photoId', (req, res) => {
  const emptyArray = []
  for (let i = 0; i < 5; i++) {
    const documentId = faker.string.uuid()
    const documentName = faker.system.commonFileName('jpg')
    emptyArray.push({ documentId, documentName })
  }

  res.send({
    result: {
      data: emptyArray,
    },
    success: true,
    error: null,
  })
})

app.delete('/api/registro/photos/:photoId', (req, res) => {
  const documentId = req.params.photoId
  if (!documentId || !isValidDocumentId(documentId)) {
    res.status(400).send({
      success: false,
      message: `Invalid documentId: ${documentId}`,
    })
  } else {
    res.send({
      success: true,
      message: `The photo with ID ${documentId} has been deleted`,
    })
  }
})

function isValidDocumentId(documentId) {
  // Add your validation logic here
  // Return true if the documentId is valid, false otherwise
  return true
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
