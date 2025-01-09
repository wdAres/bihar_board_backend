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
const archiver = require('archiver');
const previousDataModel = require('../models/previousModel');
const numberToWords = require('number-to-words')
module.exports = class AdmitCardController {
    // static addDocument = handleAsync(async (req, res, next) => {

    //     console.log(req.body)

    //     const student = await studentModel.findByPk(req.body.student_id);

    //     if (!student) {
    //         return next(new ErrorClass('No student found!', 400));
    //     }

    //     // get the required student data
    //     const studentData = {
    //         student_name: student.student_name,
    //         student_father_name: student.student_father_name,
    //         student_mother_name: student.student_mother_name,
    //         dob_in_figures: moment(student.dob_in_figures).format('DD-MM-YYYY'),
    //         dob_in_words: student.dob_in_words,
    //         student_cast: student.caste_category,
    //         student_category: student.student_category,
    //         student_sex: student.gender,
    //         student_aadhar_no: student.student_aadhar_number,
    //         school_name: student?.center?.school_name,
    //         student_required_subject: student.student_required_subject,
    //         student_additional_subject: student.student_additional_subject,
    //         student_signature: student?.student_signature,
    //         student_photo: student?.student_photo,
    //     };


    //     console.log(studentData)
    //     // get the ejs path (../views/admit_card.ejs)
    //     const ejsPath = path.join(__dirname, '..', 'views', 'admit_card.ejs');

    //     // create a pdf document and save that document in the public folder (create new folder called admit_cards)
    //     const html = await ejs.renderFile(ejsPath, studentData);


    //     const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    //     const page = await browser.newPage();
    //     await page.setContent(html, { waitUntil: 'networkidle0' });
    //     const pdfBuffer = await page.pdf({ format: 'A4' });
    //     await browser.close();

    //     const admitCardPath = path.join(__dirname, '..', 'public', 'admit_cards', `${student.student_name}_${student.id}_admit_card.pdf`);
    //     fs.writeFileSync(admitCardPath, pdfBuffer);

    //     // get the path and save that path in the req.body admit_card key
    //     req.body.admit_card = admitCardPath;

    //     // and done
    //     const doc = await admitCardModel.create(req.body);

    //     if (!doc) {
    //         return next(new ErrorClass('Something went wrong!', 400));
    //     }

    //     return new ResponseClass('Admit Card Generated Successfully.', 200, doc).send(res);
    // });

    static addDocument = handleAsync(async (req, res, next) => {

        const student = await previousDataModel.findByPk(req.body.student_id);
    
        if (!student) {
            return next(new ErrorClass('No student found!', 400));
        }
    

        // const date =  moment(student.dob_in_figures , "DDMMYYYY").format('DD-MM-YYYY'); // 12th December 2024

        // const convertDateToWords = (dateString) => { const date = moment(dateString, "DDMMYYYY"); const day = numberToWords.toWords(date.date()); const month = numberToWords.toWords(date.month() + 1); // Months are zero-indexed in moment 
        // const year = date.year().toString().split('').map(Number).map(numberToWords.toWords).join(' '); return `${day} ${month} ${year}`; };

        const date = moment(
            student.dob_in_figures.length == 7 
                ? '0' + student.dob_in_figures 
                : student.dob_in_figures, 
            "DDMMYYYY"
        ).format('DD-MM-YYYY'); 
        
        const convertDateToWords = (dateString) => {
            const formattedDateString = dateString.length == 7 ? '0' + dateString : dateString;
            const date = moment(formattedDateString, "DDMMYYYY");
            const day = numberToWords.toWords(date.date());
            const month = numberToWords.toWords(date.month() + 1); 
            const year = date.year()
                .toString()
                .split('')
                .map(Number)
                .map(numberToWords.toWords)
                .join(' ');
            return `${day} ${month} ${year}`;
        };

        const studentData = {
            student_id : student.id,
            student_name: student.student_name,
            student_father_name: student.student_father_name,
            student_mother_name: student.student_mother_name,
            dob_in_figures:date,
            dob_in_words: convertDateToWords(student?.dob_in_figures)?.toUpperCase(),
            student_category: "",
            student_cast: student.student_category,
            student_sex: student.gender,
            student_aadhar_no: student.student_aadhar_number,
            school_name: student?.school_name,
            school_name_2:student.school_name_2,
            student_required_subject: student.student_required_subject,
            additional_subject: student.additional_subject,
            student_signature: student?.student_signature,
            student_photo: 'http://127.0.0.1:8001/public/files/sahil-kumar.png',
            centre_name:student?.centre_name,
            centre_code:student?.centre_code,
            roll_no:student?.roll_no,
            registration_no:student?.registration_no,
            permission_no:'',
            board_logo:"http://127.0.0.1:8001/public/files/newLogo.png",
            qr_code:"http://127.0.0.1:8001/public/files/qr.jpeg",
            sachiv:"http://127.0.0.1:8001/public/files/sachiv.png",
            shayak:"http://127.0.0.1:8001/public/files/sahayk.png",
            controller:"http://127.0.0.1:8001/public/files/controller.png",
            student_signature:'http://127.0.0.1:8001/public/files/sign.png'
            
        };

        // const studentData = {
        //     student_name: student.student_name,
        //     student_father_name: student.student_father_name,
        //     student_mother_name: student.student_mother_name,
        //     dob_in_figures: moment(student.dob_in_figures).format('DD-MM-YYYY'),
        //     dob_in_words: student.dob_in_words,
        //     student_cast: (student.caste_category).toUpperCase(),
        //     student_category: (student.student_category).toUpperCase(),
        //     student_sex: (student.gender).toUpperCase(),
        //     student_aadhar_no: student.student_aadhar_number,
        //     school_name: student?.center?.school_name,
        //     student_required_subject: student.student_required_subject,
        //     // additional_subject: student.additional_subject,
        //     additional_subject: "MATH",
        //     student_signature: student?.student_signature,
        //     student_photo: student?.student_photo,
        //     board_logo:"http://127.0.0.1:8001/public/files/newLogo.png",
        //     qr_code:"http://127.0.0.1:8001/public/files/qr.jpeg",
        //     school_name:req.user.school_name
        // };
        const ejsPath = path.join(__dirname, '..', 'views', 'admit_card.ejs');
    
        const html = await ejs.renderFile(ejsPath, studentData);
    
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' ,printBackground: true});
        await browser.close();
    
        const admitCardFileName = `${student.student_name}_${student.id}_admit_card.pdf`;
        const admitCardPath = path.join(__dirname, '..', 'public', 'admit_cards', admitCardFileName);
        fs.writeFileSync(admitCardPath, pdfBuffer);
    
        const admitCardUrl = `http://127.0.0.1:8001/uploads/${admitCardFileName}`;
    
        req.body.admit_card = admitCardUrl;


    
        // const doc = await admitCardModel.create(req.body);
    
        // if (!doc) {
        //     return next(new ErrorClass('Something went wrong!', 400));
        // }
    
        return new ResponseClass('Admit Card Generated Successfully.', 200, {admit_card : admitCardUrl}).send(res);
    });
    
    
    static generateAdmitCardsForAlll = handleAsync(async (req, res, next) => {
        const students = await studentModel.findAll();
    
        if (!students || students.length === 0) {
            return next(new ErrorClass('No students found!', 400));
        }
    
        const ejsPath = path.join(__dirname, '..', 'views', 'admit_card.ejs');
        const admitCardsPath = path.join(__dirname, '..', 'public', 'admit_cards');
    
        if (!fs.existsSync(admitCardsPath)) {
            fs.mkdirSync(admitCardsPath, { recursive: true });
        }
    
        const baseUrl = 'http://127.0.0.1:8001/uploads';
        const admitCardUrls = [];
    
        for (const student of students) {
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
    
            const html = await ejs.renderFile(ejsPath, studentData);
    
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4' ,printBackground: true});
            await browser.close();
    
            const admitCardFileName = `${student.student_name}_${student.id}_admit_card.pdf`;
            const admitCardPath = path.join(admitCardsPath, admitCardFileName);
            fs.writeFileSync(admitCardPath, pdfBuffer);
    
            // Construct the URL
            const admitCardUrl = `${baseUrl}/${admitCardFileName}`;
            admitCardUrls.push({ student_id: student.id, url: admitCardUrl });
    
            // Save the admit card path in the database
            await admitCardModel.create({
                student_id: student.id,
                admit_card: admitCardPath,
            });
        }
    
        return new ResponseClass('Admit Cards Generated Successfully for All Students.', 200, admitCardUrls).send(res);
    });
    static generateAdmitCardsForAll = handleAsync(async (req, res, next) => {
        const students = await studentModel.findAll();
    
        if (!students || students.length === 0) {
            return next(new ErrorClass('No students found!', 400));
        }
    
        const ejsPath = path.join(__dirname, '..', 'views', 'admit_card.ejs');
        const admitCardsPath = path.join(__dirname, '..', 'public', 'admit_cards');
    
        if (!fs.existsSync(admitCardsPath)) {
            fs.mkdirSync(admitCardsPath, { recursive: true });
        }
    
        const zipFilePath = path.join(__dirname, '..', 'public', 'admit_cards', 'all_admit_cards.zip');
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });
    
        output.on('close', () => {
            res.download(zipFilePath, 'all_admit_cards.zip', (err) => {
                if (err) {
                    return next(new ErrorClass('Failed to download admit cards!', 500));
                }
            });
        });
    
        archive.on('error', (err) => {
            throw err;
        });
    
        archive.pipe(output);
    
        for (const student of students) {
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
                school_name: student?.school_name,
                school_name_2:student.school_name_2,
                student_required_subject: student.student_required_subject,
                student_additional_subject: student.student_additional_subject,
                student_signature: student?.student_signature,
                student_photo: student?.student_photo,
                centre_name:student?.centre_name,
                centre_code:student?.centre_code,
                roll_no:student?.roll_no,
            registration_no:student?.registration_no,
            permission_no:''
            };
    
            const html = await ejs.renderFile(ejsPath, studentData);
    
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            await browser.close();
    
            const admitCardFileName = `${student.student_name}_${student.id}_admit_card.pdf`;
            const admitCardPath = path.join(admitCardsPath, admitCardFileName);
            fs.writeFileSync(admitCardPath, pdfBuffer);
    
            // Add the file to the archive
            archive.file(admitCardPath, { name: admitCardFileName });
        }
    
        archive.finalize();
    });
    


}
