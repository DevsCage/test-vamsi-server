const express = require('express')
const { 
    uploadSingleDoc, 
    uploadmultipleDocs, 
    getAllDocs, 
    verifyAndRejectMultipleDocs, 
    verifyAndRejectSingleDocs, 
    verifyAndRejectFeeDocs,
    getDocsByID, 
    uploadFeeReceipt,
    uploadOtherDocs,
    verifyAndRejectOtherDocs,
    getStatusOfDocs,
    uploadmultipleDoc
} = require('../controller/documentsUploadController')
const multer = require('multer')
const path = require('path')
const dotenv = require("dotenv");
const router = express.Router()
dotenv.config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const singleDoc = multer({ storage })
const multiDoc = multer({ storage })

router.post('/add-docs/single-doc', singleDoc.single('singleDoc'), uploadSingleDoc) 
router.post('/add-docs/fee-recipt', singleDoc.single('fee'), uploadFeeReceipt) 
router.post('/add-docs/other-docs', singleDoc.single('otherDocs'), uploadOtherDocs) 
router.post('/add-docs/multi-docs', singleDoc.single('multipleDocs'), uploadmultipleDocs) 
router.post('/verify-docs/multi-docs', verifyAndRejectMultipleDocs)
router.post('/verify-docs/single-docs', verifyAndRejectSingleDocs)
router.post('/verify-docs/fee-docs', verifyAndRejectFeeDocs)
router.post('/verify-docs/other-docs', verifyAndRejectOtherDocs)
router.get('/getdocs/:id', getDocsByID)
router.get('/get-alldocs', getAllDocs)
router.post('/get-status', getStatusOfDocs)
router.post('/add-docs/multi-doc', multiDoc.array('multipleDocs'), uploadmultipleDoc)

module.exports = router