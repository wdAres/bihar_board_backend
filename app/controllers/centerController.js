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
}).single('file');

const fileSaveMiddleware = (req, res, next) => {
    if (req.file) {
        console.log(req.file)
        req.body.school_principal_signature = `uploads/school/${req.file.filename}`;
    }
    next()
}

module.exports = class CenterController extends UniversalController {

    // static getAllCenters = handleAsync(async (req, res, next) => {
    //     const centers = await userModel.findAll({ where: { role: 'center' } })
    //     const page = parseInt(req.query.page, 10) || 1;
    //     const limit = parseInt(req.query.limit, 10) || 10;

    //     const { docs, pages, total, limit: paginationLimit } = await userModel.paginate({ page, paginate: limit, where: { role: 'center' }, order: [['createdAt', 'DESC']], });


    //     const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


    //     return new ResponseClass('All inquiry data', 200, { docs, ...paginationData }).send(res)

    // })
    static addDocument = [upload, fileSaveMiddleware, UniversalController.addDocument(userModel)]
    static getDocuments = UniversalController.getDocuments(userModel)
    static getDocument = UniversalController.getDocument(userModel)
    static deleteDocument = UniversalController.deleteDocument(userModel)
    static updateDocument = [upload, fileSaveMiddleware, UniversalController.updateDocument(userModel)]

    // static deleteCenterById = handleAsync(async (req, res, next) => {

    //     const { id } = req.params;
    //     const center = await userModel.findByPk(id);

    //     if (!center) {
    //         return next(new ErrorClass('Center not found!', 404));
    //     }

    //     await center.destroy()

    //     return new ResponseClass(`center Removed`, 200, null).send(res)

    // });

    // static getDetails = handleAsync(async (req, res, next) => {
    //     const id = req.user.id;
    //     const center = await userModel.findByPk(id);

    //     if (!center) {
    //         return next(new ErrorClass('Center not found!', 404));
    //     }

    //     return new ResponseClass(`Here is your center details`, 200, center).send(res)

    // });

    // static updateDetails = handleAsync(async (req, res, next) => {

    //     const { id } = req.user;

    //     const center = await userModel.findByPk(id);

    //     if (!center) {
    //         return next(new ErrorClass('Center not found!', 404));
    //     }

    //     if (req.file) { req.body.school_principal_signature = req.file.path; }

    //     await center.update(req.body, { fields: Object.keys(req.body) })

    //     return new ResponseClass(`Details Updated`, 200, center).send(res)
    // });

}