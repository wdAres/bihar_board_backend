const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const ErrorClass = require('../utils/ErrorClass');
const UniversalController = require('./universalController');
const handleAsync = require('../utils/handleAsync');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const ResponseClass = require('../utils/ResponseClass');

const baseUrl = 'http://127.0.0.1:8001/uploads';
const uploadDir = path.join(__dirname, '../uploads');
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
            cb(new ErrorClass('Only JPEG, JPG, and PNG and 1 mb files are allowed!', 400));
        }
    },
});

const uploadFields = upload.fields([
    { name: 'student_photo', maxCount: 1 },
    { name: 'student_signature', maxCount: 1 },
    { name: 'parent_signature', maxCount: 1 },
])


const fileSaveMiddleware = (req, res, next) => {


    const files = req.files


    const requiredFiles = ['student_photo', 'student_signature', 'parent_signature'];

    const missingFiles = requiredFiles.filter(file => !files[file]);
    if (missingFiles.length > 0) {
        return next(new ErrorClass(`Missing required files: ${missingFiles.join(', ')}`, 400));
    }

    if (req.user.role === 'admin') {
        return next(new ErrorClass('Admin dosnt have this authority', 401))
    }

    req.body.center_id = req.user.id
    req.body.student_photo = `${baseUrl}/${files.student_photo[0].filename}`
    req.body.student_signature = `${baseUrl}/${files.student_signature[0].filename}`
    req.body.parent_signature = `${baseUrl}/${files.parent_signature[0].filename}`

    next()
}

const fileupdateMiddleware = (req, res, next) => {
    const files = req.files;

    console.log(files)

    // Only include keys that exist
    if (files.student_photo) {
        req.body.student_photo = `${baseUrl}/${files.student_photo[0].filename}`;
    }
    if (files.student_signature) {
        req.body.student_signature = `${baseUrl}/${files.student_signature[0].filename}`;
    }
    if (files.parent_signature) {
        req.body.parent_signature = `${baseUrl}/${files.parent_signature[0].filename}`;
    }

    req.body.center_id = req.user.id;

    next();
};



module.exports = class StudentController extends UniversalController {
    static addDocument = [uploadFields, fileSaveMiddleware, UniversalController.addDocument(studentModel)];
    static getDocuments = [handleAsync(async (req, res, next) => {
        const includeArr = [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }];
        const searchParams = ['student_name', 'student_father_name', 'student_mother_name', 'student_email', 'student_mobile_number'];

        UniversalController.getDocuments(studentModel, {}, includeArr, searchParams)(req, res, next);
    })];

    static getDocument = [handleAsync(async (req, res, next) => {
        const includeArr = [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }];
        await UniversalController.getDocument(studentModel, {}, includeArr)(req, res, next);
    })];
    static deleteDocument = UniversalController.deleteDocument(studentModel)
    static updateDocument = [uploadFields, fileupdateMiddleware, UniversalController.updateDocument(studentModel)]
    static getDocumentsByCenter = [
        handleAsync(async (req, res, next) => { await UniversalController.getDocuments(studentModel, { center_id: req.params.id })(req, res, next); })
    ]
    static getDocumentsByCenter = [handleAsync(async (req, res, next) => {
        const searchParams = ['student_name', 'student_father_name', 'student_mother_name', 'student_email', 'student_mobile_number'];

        UniversalController.getDocuments(studentModel, { center_id: req.params.id }, [], searchParams)(req, res, next);
    })];

    static getAdmitCardByStudentId = handleAsync(async (req, res, next) => {

        const studentData = { student_name: "Puneet Shrivastav", student_father_name: "Puneet Shrivastav", student_mother_name: "Puneet Shrivastav", dob_in_figures: "13/08/2002", dob_in_words: "Thirteen August Two Thousand Two", student_cast: "Regular", student_category: "General", student_sex: "male", student_aadhar_no: "123412341234", school_name: "Kendriya Vidhayala Centeral School", student_required_subject: "Sanskrit", student_additional_subject: "Maithili" };

        console.log(studentData)
        const startTime = Date.now();

        const html = await ejs.renderFile(path.join('app', 'views', 'admit_card.ejs'), studentData);
        console.log('EJS Render Time:', Date.now() - startTime);

        const browser = await puppeteer.launch({ headless: true });
        console.log('Browser Launch Time:', Date.now() - startTime);

        const page = await browser.newPage();
        await page.setContent(html);
        console.log('Page Set Content Time:', Date.now() - startTime);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();
        console.log('PDF Generation Time:', Date.now() - startTime);


        res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=admit_card.pdf', });

        console.log('we are in final')

        res.status(200).send(pdfBuffer);

    });


    static totalStudents = handleAsync(async (req, res, next) => {
            const totalStudents = await studentModel.count();
            return new ResponseClass('Total Students' , 200 , {count:totalStudents}).send(res)
    });


};