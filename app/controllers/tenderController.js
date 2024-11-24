const tenderModel = require('../models/tenderModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ErrorClass = require('../utils/errorClass');
const handleAsync = require('../utils/handleAsync');
const handlePagination = require('../utils/handlePagination');
const ResponseClass = require('../utils/ResponseClass');
const UniversalController = require('./universalController');

const baseUrl = 'http://127.0.0.1:8001/uploads/tenders';
const uploadDir = path.join(__dirname, '../uploads/tenders');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new ErrorClass('Only images, PDFs, and DOCX files are allowed!', 400));
        }
    },
}).single('file');

const fileSaveMiddleware = (req, res, next) => {
    if (req.file) {
        req.body.file = `uploads/notices/${req.file.filename}`;
    }
    next()
}

module.exports = class TenderController  extends UniversalController {
    static addDocument = [upload, fileSaveMiddleware, UniversalController.addDocument(tenderModel)];
    static getDocuments = UniversalController.getDocuments(tenderModel)
    static getDocument = UniversalController.getDocument(tenderModel)
    static deleteDocument = UniversalController.deleteDocument(tenderModel)
    static updateDocument = [upload, fileSaveMiddleware, UniversalController.updateDocument(tenderModel)]
};
