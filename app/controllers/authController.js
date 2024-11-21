const userModel = require("../models/userModel")
const ErrorClass = require("../utils/ErrorClass")
const handleAsync = require("../utils/handleAsync")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createSendToken } = require("../utils/handleToken")
const ResponseClass = require("../utils/ResponseClass")
const path = require('path');
const multer = require('multer');
const fs = require('fs');


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
    limits: {
        fileSize: 1 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new ErrorClass('Only JPEG, JPG, and PNG files under 1 MB are allowed!', 400));
        }
    },
});

module.exports = class AuthController {

    static createSchool = [
        upload.fields([
            { name: 'center_signature', maxCount: 1 },
            { name: 'school_principal_signature', maxCount: 1 },
        ]),
        
        handleAsync(async (req, res, next) => {
            try {
                const { body, files } = req;
                const requiredFiles = ['center_signature', 'school_principal_signature'];
                const missingFiles = requiredFiles.filter(file => !files[file]);

                if (missingFiles.length > 0) {
                    return next(new ErrorClass(`Missing required files: ${missingFiles.join(', ')}`, 400));
                }

                const newSchool = await userModel.create({
                    ...Object.fromEntries(Object.entries(body).map(([key, value]) => [key, value.trim()])), 
                    center_signature: files.center_signature[0].path,
                    school_principal_signature: files.school_principal_signature[0].path,
                });

                if (!newSchool) {
                    return next(new ErrorClass('Failed to create school record!', 400));
                }

                return new ResponseClass('School created successfully!', 200, newSchool).send(res);
            } catch (error) {
                next(new ErrorClass(error.message || 'Something went wrong!', 500));
            }
        })
    ];

    static loginUser = handleAsync(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorClass('required information in missing!', 400))
        }

        const user = await userModel.findOne({ where: { email: email } })

        const passwordMatch = await user.comparePassword(password)

        if (!user || !passwordMatch) {
            return next(new ErrorClass('invalid password or email', 401))
        }

        createSendToken(user, 200, res);

    })

}
