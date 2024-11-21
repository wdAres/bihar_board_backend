const noticeModel = require('../models/noticeModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ErrorClass = require('../utils/errorClass');
const handleAsync = require('../utils/handleAsync');
const handlePagination = require('../utils/handlePagination')
const ResponseClass = require('../utils/ResponseClass')
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

module.exports = class NoticeController {
    // Create a new notice
    static createNotice = [
        upload,
        handleAsync(async (req, res, next) => {
            const { label } = req.body;

            if (!req.file) {
                return next(new ErrorClass('File is required!', 400));
            }

            const newNotice = await noticeModel.create({
                label,
                file: `uploads/notices/${req.file.filename}`, // Save relative path
            });

           
            return new ResponseClass('Thank you for create notice', 200, newNotice).send(res)
        }),
    ];

    // Get all notices
    static getAllNotices = handleAsync(async (req, res, next) => {
        // const notices = await noticeModel.findAll();
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await noticeModel.paginate({ page, paginate:limit });


        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


        return new ResponseClass('All notice data', 200, { docs, ...paginationData }).send(res)
        
    });

    // Get a single notice by ID
    static getNoticeById = handleAsync(async (req, res, next) => {
        const { id } = req.params;

        const notice = await noticeModel.findByPk(id);

        if (!notice) {
            return next(new ErrorClass('Notice not found!', 404));
        }
        return new ResponseClass('Notice retrieved successfully', 200, notice).send(res)
        
        
    });

    // Update a notice by ID
    static updateNotice = [
        upload,
        handleAsync(async (req, res, next) => {
            const { id } = req.params;
            const { label } = req.body;

            const notice = await noticeModel.findByPk(id);

            if (!notice) {
                return next(new ErrorClass('Notice not found!', 404));
            }

            notice.label = label || notice.label;

            if (req.file) {
                notice.file = `uploads/notices/${req.file.filename}`;
            }

            await notice.save();
            return new ResponseClass('Notice updated successfully!', 200, notice).send(res)
            
        }),
    ];

    // Delete a notice by ID
    static deleteNotice = handleAsync(async (req, res, next) => {
        try {
            const { id } = req.params;
    
            const notice = await noticeModel.findByPk(id);

            console.log(notice)
    
            if (!notice) {
                return next(new ErrorClass('Notice not found!', 404));
            }
    
            // Delete the file from the server
            const filePath = path.join(__dirname, '../', notice.file);
            console.log(`Deleting file at: ${filePath}`);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('File deleted successfully');
            } else {
                console.log('File does not exist');
            }
    
            await notice.destroy();
            console.log('Notice deleted successfully from DB');
    
            return new ResponseClass('Notice deleted successfully!', 200, notice).send(res);
        } catch (error) {
            console.error('Error deleting notice:', error);
            return next(new ErrorClass('Server error!', 500));
        }
    });
    
};
