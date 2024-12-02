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
            // { name: 'center_signature', maxCount: 1 },
            { name: 'school_principal_signature', maxCount: 1 },
        ]),
        
        handleAsync(async (req, res, next) => {
                const { body, files } = req;
                const requiredFiles = ['school_principal_signature'];
                const missingFiles = requiredFiles.filter(file => !files[file]);

                if (missingFiles.length > 0) {
                    return next(new ErrorClass(`Missing required files: ${missingFiles.join(', ')}`, 400));
                }

                const newSchool = await userModel.create({
                    ...Object.fromEntries(Object.entries(body).map(([key, value]) => [key, value.trim()])), 
                    
                    school_principal_signature: `${baseUrl}/${files.school_principal_signature[0].filename}`,
                });

                if (!newSchool) {
                    return next(new ErrorClass('Failed to create school record!', 400));
                }

                return new ResponseClass('School created successfully!', 200, newSchool).send(res);
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
