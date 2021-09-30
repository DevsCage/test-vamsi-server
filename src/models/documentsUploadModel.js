const mongoose = require('mongoose')

const documentSchema = mongoose.Schema({
    stud_regNo: { 
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    singleDocs: [
        {
            image: Buffer,
            contentType: String,
            name: {
                type: String,
                required: true,
                enum: ["AdhaarCard","CasteCertificate", "BankPassbook", "IncomeCertificate"]
            },
            verified: {
                type: Boolean,
                default: false
            },
            rejected: {
                type: Boolean,
                default: false
            }
        }
    ],
    multipleDocs: [
        {
            Document_type: {
                type: String,
                enum: ["AdhaarOfParents","SSCAndHSCMarksCards", "SportsRelatedDocs"]
            },
            Document: [
                {
                    image: Buffer,
                    contentType: String,
                    name: {
                        type: String
                    }
                } 
            ],
            verified: {
                type: Boolean,
                default: false
            },
            rejected: {
                type: Boolean,
                default: false
            }
        }
    ],
    feeReceipt: [
        {
            image: Buffer,
            contentType: String,
            name: {
                type: String,
                required: true,
                enum: [
                        "FeeReceipt-1", 
                        "FeeReceipt-2", 
                        "FeeReceipt-3", 
                        "FeeReceipt-4", 
                        "FeeReceipt-5", 
                        "FeeReceipt-6",
                        "FeeReceipt-7",
                        "FeeReceipt-8",
                        "FeeReceipt-9",
                        "FeeReceipt-10",
                        "FeeReceipt-11",
                        "FeeReceipt-12",
                        "FeeReceipt-13",
                        "FeeReceipt-14",
                        "FeeReceipt-15",
                        "FeeReceipt-16"
                        ]
            },
            verified: {
                type: Boolean,
                default: false
            },
            rejected: {
                type: Boolean,
                default: false
            }
        }
    ],
    othersDocs: [
        {
            image: Buffer,
            contentType: String,
            name: {
                type: String,
                required: true,
                enum: ["OtherDocs-1", "OtherDocs-2", "OtherDocs-3", "OtherDocs-4", "OtherDocs-5"]
            },
            verified: {
                type: Boolean,
                default: false
            },
            rejected: {
                type: Boolean,
                default: false
            }
        }
    ]
})

const documentUploadModel = mongoose.model('Documents', documentSchema)

module.exports = documentUploadModel