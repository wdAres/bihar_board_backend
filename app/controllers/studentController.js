const multer = require('multer');
const path = require('path');
const fs = require('fs');
const studentModel = require('../models/studentModel');

const ErrorClass = require('../utils/errorClass');
const handleAsync = require("../utils/handleAsync");

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new ErrorClass('Only images and PDFs are allowed!', 400));
        }
    },
});

module.exports = class StudentController {
    // Create a new student record
    static createStudent = [
        upload.fields([
            { name: 'student_photo', maxCount: 1 },
            { name: 'student_signature', maxCount: 1 },
            { name: 'parent_signature', maxCount: 1 },
            { name: 'center_signature', maxCount: 1 },
            { name: 'school_principal_signature', maxCount: 1 },
        ]),
        handleAsync(async (req, res, next) => {
            try {
                // Destructure request body
                const {
                    school_category,
                    school_name,
                    school_address,
                    school_pincode,
                    center_name,
                    center_address,
                    student_name,
                    student_father_name,
                    student_mother_name,
                    dob_in_figures,
                    dob_in_words,
                    additional_subject,
                    gender,
                    caste_category,
                    student_address_mohalla,
                    student_address_po,
                    student_address_sub_div,
                    student_address_pin,
                    student_address_ps,
                    student_address_dist,
                    student_email,
                    student_mobile_number,
                    student_aadhar_number,
                    nationality,
                    religion,
                    handicapped,
                    student_category,
                    school_principal_email,
                    school_principal_mobile,
                    center_id,
                } = req.body;

                // File upload validation
                const files = req.files;

                // Check if required fields are present
                if (!student_email || !student_mobile_number || !student_aadhar_number) {
                    return next(new ErrorClass('Email, Mobile number, and Aadhar number are required!', 400));
                }

                // Check if student already exists by email or Aadhar number
                const existingStudentByEmail = await studentModel.findOne({ where: { student_email } });
                if (existingStudentByEmail) {
                    return next(new ErrorClass('A student with this email already exists!', 400));
                }
                
                const existingStudentBymobile = await studentModel.findOne({ where: { student_mobile_number } });
                if (existingStudentBymobile) {
                    return next(new ErrorClass('A student with this mobile no already exists!', 400));
                }
                const existingStudentByAadhar = await studentModel.findOne({ where: { student_aadhar_number } });
                if (existingStudentByAadhar) {
                    return next(new ErrorClass('A student with this Aadhar number already exists!', 400));
                }

                // Create a new student record
                const newStudent = await studentModel.create({
                    school_category,
                    school_name,
                    school_address,
                    school_pincode,
                    center_name,
                    center_address,
                    student_name,
                    student_father_name,
                    student_mother_name,
                    dob_in_figures,
                    dob_in_words,
                    additional_subject,
                    gender,
                    caste_category,
                    student_address_mohalla,
                    student_address_po,
                    student_address_sub_div,
                    student_address_pin,
                    student_address_ps,
                    student_address_dist,
                    student_email,
                    student_mobile_number,
                    student_aadhar_number,
                    nationality,
                    religion,
                    handicapped,
                    student_category,
                    school_principal_email,
                    school_principal_mobile,
                    center_id,
                    student_photo: files.student_photo ? files.student_photo[0].path : null,
                    student_signature: files.student_signature ? files.student_signature[0].path : null,
                    parent_signature: files.parent_signature ? files.parent_signature[0].path : null,
                    center_signature: files.center_signature ? files.center_signature[0].path : null,
                    school_principal_signature: files.school_principal_signature
                        ? files.school_principal_signature[0].path
                        : null,
                });

                if (!newStudent) {
                    return next(new ErrorClass('Failed to create student record!', 400));
                }

                res.status(201).json({
                    message: 'Student record created successfully!',
                    status: 'success',
                    data: {
                        student: newStudent,
                    },
                });
            } catch (error) {
                next(new ErrorClass(error.message || 'Something went wrong!', 500));
            }
        }),
    ];

    // Get student records
    static getStudents = async (req, res, next) => {
        try {
            const { id } = req.params; // Get student ID from the route parameters

            if (id) {
                // Fetch a single student record by ID
                const student = await studentModel.findOne({ where: { id } });

                if (!student) {
                    return res.status(404).json({
                        message: 'Student not found!',
                        status: 'error',
                    });
                }

                return res.status(200).json({
                    message: 'Student record retrieved successfully!',
                    status: 'success',
                    data: {
                        student,
                    },
                });
            }

            // Fetch all student records
            const students = await studentModel.findAll();

            res.status(200).json({
                message: 'All student records retrieved successfully!',
                status: 'success',
                data: {
                    students,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || 'Something went wrong!',
                status: 'error',
            });
        }
    };

    // Update an existing student record
static updateStudent = [
    upload.fields([
        { name: 'student_photo', maxCount: 1 },
        { name: 'student_signature', maxCount: 1 },
        { name: 'parent_signature', maxCount: 1 },
        { name: 'center_signature', maxCount: 1 },
        { name: 'school_principal_signature', maxCount: 1 },
    ]),
    handleAsync(async (req, res, next) => {
        try {
            const { id } = req.params; // Get student ID from the route parameters
            if (!id) {
                return next(new ErrorClass('Student ID is required!', 400));
            }

            const {
                school_category,
                school_name,
                school_address,
                school_pincode,
                center_name,
                center_address,
                student_name,
                student_father_name,
                student_mother_name,
                dob_in_figures,
                dob_in_words,
                additional_subject,
                gender,
                caste_category,
                student_address_mohalla,
                student_address_po,
                student_address_sub_div,
                student_address_pin,
                student_address_ps,
                student_address_dist,
                student_email,
                student_mobile_number,
                student_aadhar_number,
                nationality,
                religion,
                handicapped,
                student_category,
                school_principal_email,
                school_principal_mobile,
                center_id,
            } = req.body;

            // File upload validation
            const files = req.files;

            // Check if required fields are present
            if (!student_email || !student_mobile_number || !student_aadhar_number) {
                return next(new ErrorClass('Email, Mobile number, and Aadhar number are required!', 400));
            }

            // Check if student already exists by email or Aadhar number
            const existingStudentByEmail = await studentModel.findOne({
                where: { student_email, id: { [Op.ne]: id } }, // Exclude current student
            });
            if (existingStudentByEmail) {
                return next(new ErrorClass('A student with this email already exists!', 400));
            }

            const existingStudentByAadhar = await studentModel.findOne({
                where: { student_aadhar_number, id: { [Op.ne]: id } }, // Exclude current student
            });
            if (existingStudentByAadhar) {
                return next(new ErrorClass('A student with this Aadhar number already exists!', 400));
            }

            // Fetch the student record to update
            const student = await studentModel.findOne({ where: { id } });
            if (!student) {
                return next(new ErrorClass('Student not found!', 404));
            }

            // Update student record with new data
            const updatedStudent = await student.update({
                school_category,
                school_name,
                school_address,
                school_pincode,
                center_name,
                center_address,
                student_name,
                student_father_name,
                student_mother_name,
                dob_in_figures,
                dob_in_words,
                additional_subject,
                gender,
                caste_category,
                student_address_mohalla,
                student_address_po,
                student_address_sub_div,
                student_address_pin,
                student_address_ps,
                student_address_dist,
                student_email,
                student_mobile_number,
                student_aadhar_number,
                nationality,
                religion,
                handicapped,
                student_category,
                school_principal_email,
                school_principal_mobile,
                center_id,
                student_photo: files.student_photo ? files.student_photo[0].path : student.student_photo,
                student_signature: files.student_signature ? files.student_signature[0].path : student.student_signature,
                parent_signature: files.parent_signature ? files.parent_signature[0].path : student.parent_signature,
                center_signature: files.center_signature ? files.center_signature[0].path : student.center_signature,
                school_principal_signature: files.school_principal_signature
                    ? files.school_principal_signature[0].path
                    : student.school_principal_signature,
            });

            if (!updatedStudent) {
                return next(new ErrorClass('Failed to update student record!', 400));
            }

            res.status(200).json({
                message: 'Student record updated successfully!',
                status: 'success',
                data: {
                    student: updatedStudent,
                },
            });
        } catch (error) {
            next(new ErrorClass(error.message || 'Something went wrong!', 500));
        }
    }),
];

};
