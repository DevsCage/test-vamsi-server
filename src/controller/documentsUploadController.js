const DocumentsList = require('../models/documentsUploadModel')
const fs = require('fs')
const path = require('path')

const uploadSingleDoc = (req, res) => {
    DocumentsList.findOne({ "stud_regNo": req.body.stud_regNo })
    .exec((err, doc) => {
        if (err) res.status(400).json({ message: "Couldn't find Student" })
        const document = {
            image: fs.readFileSync(path.join(path.dirname(__dirname) + "/uploads/" + req.file.filename)),
            contentType: req.file.mimetype,
            name: req.body.Document_type
        }

        if (doc) {
            const findThePresentDoc = doc.singleDocs.find(el => {
                return el.name === document.name
            })

            if (findThePresentDoc == undefined) {
                DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo }, {
                    "$push": {
                        "singleDocs": document
                    }
                }, { new: !0, upsert: !0 })
                    .exec((err, data) => {
                        if (err) res.status(400).json(err)
                        if (data) {
                            res.status(201).json({ data })
                        }
                    })
            }
            if (findThePresentDoc) {
                DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo, "singleDocs.name": req.body.Document_type }, {
                    "$set": {
                        "singleDocs.$": {
                            ...document,
                            verified: false,
                            rejected: false
                        }
                    }
                }, { new: !0, upsert: !0 })
                    .exec((err, data) => {
                        if (err) res.status(400).json(err)
                        if (data) {
                            res.status(201).json({ data })
                        }
                    })
            }
        } else {
            const newdoc = new DocumentsList({
                stud_regNo: req.body.stud_regNo,
                student: req.body.student,
                singleDocs: {
                    image: document.image,
                    contentType: document.contentType,
                    name: document.name
                }
            })
            newdoc.save((err, done) => {
                if (err) res.status(400).json({ message: err.message })
                if (done) res.status(201).json({ done, message: "Uploaded" })
            })
        }
    })
}

const uploadmultipleDocs = async (req, res) => {
    await DocumentsList.findOne({ "stud_regNo": req.body.stud_regNo })
        .exec((err, doc) => {
            if (err) res.status(400).json({ message: "Student not Found", err })

            const document = {
                image: fs.readFileSync(path.join(path.dirname(__dirname) + "/uploads/" + req.file.filename)),
                contentType: req.file.mimetype,
                name: req.body.Document_type
            }

            if (doc) {
                const findDocumentType = doc.multipleDocs.find(el => {
                    return el.Document_type === req.body.Document_type
                })
                if (findDocumentType == undefined) {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo }, {
                        "$push": {
                            "multipleDocs": {
                                "Document_type": req.body.Document_type,
                                "Document": document
                            }
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json({ message: "ERROR PUSHING NEW DOCUMENT TO MULTIDOCS", err })
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                }
                if (findDocumentType != undefined) {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo, "multipleDocs._id": findDocumentType._id }, {
                        "$push": {
                            "multipleDocs.$.Document": document
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json({ message: "ERROR ADDING NEW DOCUMENT TO ARRAY", err })
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                }
            } else {
                const newdoc = new DocumentsList({
                    stud_regNo: req.body.stud_regNo,
                    student: req.body.student,
                    multipleDocs: {
                        Document_type: req.body.Document_type,
                        Document: document
                    }
                })
                newdoc.save((err, done) => {
                    if (err) res.status(400).json({ message: "ERROR SAVING NEW STUDENT", err })
                    if (done) res.status(201).json({ done })
                })
            }
        })
}

const uploadmultipleDoc = (req, res) => {
    DocumentsList.findOne({ "stud_regNo": req.body.stud_regNo })
        .exec((err, doc) => {
            if (err) res.status(400).json({ err })

            let documentImagesArray = []

            if (req.files.length > 0) {
                documentImagesArray = req.files.map((file, i) => {
                    return {
                        image: fs.readFileSync(path.join(path.dirname(__dirname) + "/uploads/" + file.filename)),
                        contentType: file.mimetype,
                        name: req.body.Document_type + i
                    }
                })
            }

            if (doc) {
                const findDocumentType = doc.multipleDocs.find(el => {
                    return el.Document_type === req.body.Document_type
                })

                if (!findDocumentType) {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo }, {
                        "$push": {
                            "multipleDocs": {
                                "Document_type": req.body.Document_type,
                                "Document": documentImagesArray
                            }
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json({ message: err })
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                } else {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo, "multipleDocs.Document_type": req.body.Document_type }, {
                        "$set": {
                            "multipleDocs.$.verified": false,
                            "multipleDocs.$.rejected": false,
                            "multipleDocs.$.Document": documentImagesArray
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json({ message: "Upating Failed", err })
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                }
            } else {
                const newdoc = new DocumentsList({
                    stud_regNo: req.body.stud_regNo,
                    student: req.body.student,
                    multipleDocs: {
                        Document_type: req.body.Document_type,
                        Document: documentImagesArray
                    }
                })
                newdoc.save((err, done) => {
                    if (err) res.status(400).json({ message: err.message })
                    if (done) res.status(201).json({ done })
                })
            }
        })
}

const uploadFeeReceipt = (req, res) => {

    const document = {
        image: fs.readFileSync(path.join(path.dirname(__dirname) + "/uploads/" + req.file.filename)),
        contentType: req.file.mimetype,
        name: req.body.Document_type
    }

    DocumentsList.findOne({ "stud_regNo": req.body.stud_regNo })
        .exec((err, doc) => {
            if (err) res.status(400).json({ err })
            if (doc) {
                const findDoc = doc.feeReceipt.find(el => {
                    return el.name === req.body.Document_type
                })

                if (findDoc !== undefined) {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo, "feeReceipt.name": req.body.Document_type }, {
                        "$set": {
                            "feeReceipt.$": {
                                ...document,
                                verified: false,
                                rejected: false
                            }
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                }
                if (findDoc == undefined) {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo }, {
                        "$push": {
                            "feeReceipt": document
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                }
            } else {
                const newdoc = new DocumentsList({
                    stud_regNo: req.body.stud_regNo,
                    student: req.body.student,
                    feeReceipt: {
                        image: document.image,
                        contentType: document.contentType,
                        name: document.name
                    }
                })
                newdoc.save((err, done) => {
                    if (err) res.status(400).json({ err: err.message, message: "Couldn't Upload Fee Receipt" })
                    if (done) res.status(201).json({ done })
                })
            }
        })
}

const uploadOtherDocs = (req, res) => {

    const document = {
        image: fs.readFileSync(path.join(path.dirname(__dirname) + "/uploads/" + req.file.filename)),
        contentType: req.file.mimetype,
        name: req.body.Document_type
    }

    DocumentsList.findOne({ "stud_regNo": req.body.stud_regNo })
        .exec((err, doc) => {
            if (err) res.status(400).json({ err })
            if (doc) {
                const findDoc = doc.othersDocs.find(el => {
                    return el.name === req.body.Document_type
                })

                if (findDoc == undefined) {
                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo }, {
                        "$push": {
                            "othersDocs": document
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json({ err, message: "Couldn't Upload Other Docs" })
                            if (data) {
                                res.status(201).json({ message: "Uploaded" })
                            }
                        })
                }
                if (findDoc !== undefined) {

                    DocumentsList.findOneAndUpdate({ "stud_regNo": req.body.stud_regNo, "othersDocs.name": req.body.Document_type }, {
                        "$set": {
                            "othersDocs.$": {
                                ...document,
                                verified: false,
                                rejected: false
                            }
                        }
                    }, { new: !0, upsert: !0 })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) {
                                res.status(201).json({ data })
                            }
                        })
                }
            } else {
                const newdoc = new DocumentsList({
                    stud_regNo: req.body.stud_regNo,
                    student: req.body.student,
                    othersDocs: {
                        image: document.image,
                        contentType: document.contentType,
                        name: document.name
                    }
                })
                newdoc.save((err, done) => {
                    if (err) res.status(400).json({ err: err.message, message: "Couldn't Upload Other Docs" })
                    if (done) res.status(201).json({ done })
                })
            }
        })
}

const verifyAndRejectSingleDocs = (req, res) => {
    DocumentsList.findOne({ "stud_regNo": req.body.regNo })
        .select('stud_regNo singleDocs')
        .populate('student', 'stud_fname stud_lname student_reg_num')
        .exec((error, doc) => {
            if (error) res.status(400).json({ message: error })
            if (doc) {
                if (req.body.rejected === true) {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "singleDocs._id": req.body._id }, {
                        $set: {
                            "singleDocs.$.rejected": req.body.rejected,
                            "singleDocs.$.verified": true
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                } else {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "singleDocs._id": req.body._id }, {
                        $set: {
                            "singleDocs.$.verified": req.body.verified,
                            "singleDocs.$.rejected": false,
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                }
            }
        })
}

const verifyAndRejectMultipleDocs = (req, res) => {
    DocumentsList.findOne({ "stud_regNo": req.body.regNo })
        .select('stud_regNo multipleDocs')
        .populate('student', 'stud_fname stud_lname student_reg_num')
        .exec((error, doc) => {
            if (error) res.status(400).json({ message: error })
            if (doc) {
                if (req.body.rejected === true) {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "multipleDocs._id": req.body._id }, {
                        $set: {
                            "multipleDocs.$.rejected": req.body.rejected,
                            "multipleDocs.$.verified": true
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                } else {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "multipleDocs._id": req.body._id }, {
                        $set: {
                            "multipleDocs.$.verified": req.body.verified,
                            "multipleDocs.$.rejected": false
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                }
            }
        })
}

const verifyAndRejectFeeDocs = (req, res) => {
    DocumentsList.findOne({ "stud_regNo": req.body.regNo })
        .select('stud_regNo feeReceipt')
        .populate('student', 'stud_fname stud_lname student_reg_num')
        .exec((error, doc) => {
            if (error) res.status(400).json({ message: error })
            if (doc) {
                if (req.body.rejected === true) {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "feeReceipt._id": req.body._id }, {
                        $set: {
                            "feeReceipt.$.rejected": req.body.rejected,
                            "feeReceipt.$.verified": true
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                } else {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "feeReceipt._id": req.body._id }, {
                        $set: {
                            "feeReceipt.$.verified": req.body.verified,
                            "feeReceipt.$.rejected": false
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                }
            }
        })
}

const verifyAndRejectOtherDocs = (req, res) => {
    DocumentsList.findOne({ "stud_regNo": req.body.regNo })
        .select('stud_regNo othersDocs')
        .populate('student', 'stud_fname stud_lname student_reg_num')
        .exec((error, doc) => {
            if (error) res.status(400).json({ message: error })
            if (doc) {
                if (req.body.rejected === true) {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "othersDocs._id": req.body._id }, {
                        $set: {
                            "othersDocs.$.rejected": req.body.rejected,
                            "othersDocs.$.verified": true
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                } else {
                    DocumentsList.findOneAndUpdate({ "_id": doc._id, "othersDocs._id": req.body._id }, {
                        $set: {
                            "othersDocs.$.verified": req.body.verified,
                            "othersDocs.$.rejected": false
                        }
                    }, { new: true })
                        .exec((err, data) => {
                            if (err) res.status(400).json(err)
                            if (data) res.status(201).json(data)
                        })
                }
            }
        })
}

const getStatusOfDocs = async (req, res) => {
    await DocumentsList.findOne({ "stud_regNo": req.body.student_regNo })
        .select('singleDocs.verified singleDocs.rejected singleDocs.name multipleDocs.Document_type multipleDocs.rejected multipleDocs.verified feeReceipt.name feeReceipt.rejected feeReceipt.verified othersDocs.name othersDocs.rejected othersDocs.verified')
        .exec((err, docs) => {
            if (docs) res.status(201).json(docs)
            else res.status(400).json({ message: "Student not Found" })
        })
}

const getDocsByID = (req, res) => {
    DocumentsList.findOne({ "_id": req.params.id })
        .populate('student', 'stud_fname stud_lname student_reg_num')
        .exec((err, docs) => {
            if (docs) res.status(201).json(docs)
            else res.status(400).json({ message: "Something went wrong" })
        })
}

const getAllDocs = (req, res) => {
    DocumentsList.find()
        .select('stud_regNo _id')
        .populate('student', 'stud_fname stud_lname stud_reg_num')
        .exec((err, docs) => {
            if (err) res.status(400).json({ message: err })
            if (docs) {
                res.status(201).json({ docs })
            }
        })
}

module.exports = {
    uploadSingleDoc,
    uploadmultipleDocs,
    uploadmultipleDoc,
    uploadFeeReceipt,
    uploadOtherDocs,
    verifyAndRejectMultipleDocs,
    verifyAndRejectSingleDocs,
    verifyAndRejectFeeDocs,
    verifyAndRejectOtherDocs,
    getDocsByID,
    getAllDocs,
    getStatusOfDocs
}
