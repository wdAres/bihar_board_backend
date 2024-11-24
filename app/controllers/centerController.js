const userModel = require("../models/userModel")
const handleAsync = require("../utils/handleAsync")
const ResponseClass = require('../utils/ResponseClass')
const handlePagination = require('../utils/handlePagination');
const UniversalController = require("./universalController");
const path = require('path')
const fs = require('fs');
const multer = require("multer");

const baseUrl = 'http://127.0.0.1:8001/uploads';
const uploadDir = path.join(__dirname, '../uploads/school');

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
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new ErrorClass('Only images files are allowed!', 400));
        }
    },
}).single('school_principal_signature');

const fileSaveMiddleware = (req, res, next) => {
    console.log(req.file )
    if (req.file) {
        req.body.school_principal_signature = `uploads/school/${req.file.filename}`;
    }
    next()
}



module.exports = class CenterController extends UniversalController {

    static addDocument = [upload, fileSaveMiddleware, UniversalController.addDocument(userModel)]
    static getDocuments = UniversalController.getDocuments(userModel)
    static getDocument = UniversalController.getDocument(userModel)
    static deleteDocument = UniversalController.deleteDocument(userModel)
    static updateDocument = [upload, fileSaveMiddleware, UniversalController.updateDocument(userModel)]
    
}