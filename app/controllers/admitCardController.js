const admitCardModel = require('../models/admitCardModel');
const ErrorClass = require('../utils/ErrorClass');
const handleAsync = require('../utils/handleAsync');
const ResponseClass = require('../utils/ResponseClass');
const StudentController = require('./studentController');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const studentModel = require('../models/studentModel');
const moment = require('moment')

module.exports = class AdmitCardController {
    static addDocument = handleAsync(async (req, res, next) => {
        const student = await studentModel.findByPk(req.body.student_id);

        if (!student) {
            return next(new ErrorClass('No student found!', 400));
        }

        // get the required student data
        const studentData = {
            student_name: student.student_name,
            student_father_name: student.student_father_name,
            student_mother_name: student.student_mother_name,
            dob_in_figures: moment(student.dob_in_figures).format('DD-MM-YYYY'),
            dob_in_words: student.dob_in_words,
            student_cast: student.caste_category,
            student_category: student.student_category,
            student_sex: student.gender,
            student_aadhar_no: student.student_aadhar_number,
            school_name: student?.center?.school_name,
            student_required_subject: student.student_required_subject,
            student_additional_subject: student.student_additional_subject,
            student_signature: student?.student_signature,
            student_photo: student?.student_photo,
        };


        console.log(studentData)
        // get the ejs path (../views/admit_card.ejs)
        const ejsPath = path.join(__dirname, '..', 'views', 'admit_card.ejs');

        // create a pdf document and save that document in the public folder (create new folder called admit_cards)
        const html = await ejs.renderFile(ejsPath, studentData);


        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        const admitCardPath = path.join(__dirname, '..', 'public', 'admit_cards', `${student.student_name}_${student.id}_admit_card.pdf`);
        fs.writeFileSync(admitCardPath, pdfBuffer);

        // get the path and save that path in the req.body admit_card key
        req.body.admit_card = admitCardPath;

        // and done
        const doc = await admitCardModel.create(req.body);

        if (!doc) {
            return next(new ErrorClass('Something went wrong!', 400));
        }

        return new ResponseClass('Admit Card Generated Successfully.', 200, doc).send(res);
    });

}
