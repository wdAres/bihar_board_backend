const tenderModel = require('../models/tenderModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ErrorClass = require('../utils/ErrorClass');
const handleAsync = require('../utils/handleAsync');
const handlePagination = require('../utils/handlePagination');
const ResponseClass = require('../utils/ResponseClass');

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

module.exports = class TenderController {
    static createTender = [
        upload,
        handleAsync(async (req, res, next) => {
            const { label } = req.body;

            if (!req.file) {
                return next(new ErrorClass('File is required!', 400));
            }

            const newTender = await tenderModel.create({
                label,
                file: `${baseUrl}/${req.file.filename}`,
            });

            return new ResponseClass('Tender created successfully!', 200, newTender).send(res);
        }),
    ];
    static getAllTenders = handleAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await tenderModel.paginate({
            page,
            paginate: limit,
            order: [['createdAt', 'DESC']],
        });

        const tendersWithLatest = docs.map(tender => ({
            ...tender.toJSON(),
            isLatest: tender.isLatest
        }));

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
        return new ResponseClass('All tenders retrieved successfully!', 200, { docs: tendersWithLatest, ...paginationData }).send(res);
    });

    static deleteTender = handleAsync(async (req, res, next) => {
        try {
            const { id } = req.params;
            const tender = await tenderModel.findByPk(id);
            if (!tender) {
                return next(new ErrorClass('Tender not found!', 404));

            }
            const filePath = path.join(__dirname, '../', tender.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);

            }
            await tender.destroy();
            return new ResponseClass('Tender deleted successfully!', 200, tender).send(res);
        }
        catch (error) { return next(new ErrorClass('Server error!', 500)); }
    });


    static updateTender = [upload, handleAsync(async (req, res, next) => {
        const { id } = req.params; const { label } = req.body;
        const tender = await tenderModel.findByPk(id);
        if (!tender) {
            return next(new ErrorClass('Tender not found!', 404));

        } tender.label = label || tender.label; if (req.file) { tender.file = `${baseUrl}/${req.file.filename}`; }
        await tender.save();
        return new ResponseClass('Tender updated successfully!', 200, { ...tender.toJSON(), isLatest: tender.isLatest }).send(res);
    }),];


    static getTenderById = handleAsync(async (req, res, next) => {
        const { id } = req.params; const tender = await tenderModel.findByPk(id);
        if (!tender) {
            return next(new ErrorClass('Tender not found!', 404));

        }
        return new ResponseClass('Tender retrieved successfully', 200, {
            ...tender.toJSON(),
            isLatest: tender.isLatest
        }).send(res);
    });
};
