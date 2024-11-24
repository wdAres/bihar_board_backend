const noticeModel = require('../models/noticeModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ErrorClass = require('../utils/ErrorClass');
const ResponseClass = require('../utils/ResponseClass');
const UniversalController = require('./universalController');

const uploadDir = path.join(__dirname, '../uploads/notices');
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

module.exports = class NoticeController extends UniversalController {
    static addDocument = [upload, fileSaveMiddleware, UniversalController.addDocument(noticeModel)];
    static getDocuments = UniversalController.getDocuments(noticeModel)
    static getDocument = UniversalController.getDocument(noticeModel)
    static deleteDocument = UniversalController.deleteDocument(noticeModel)
    static updateDocument = [upload, fileSaveMiddleware, UniversalController.updateDocument(noticeModel)]
};
