const multer = require('multer');
const path = require('path');
const fs = require('fs');
const studentModel = require('../models/studentModel');
const ResponseClass = require('../utils/ResponseClass')
const ErrorClass = require('../utils/errorClass');
const handleAsync = require("../utils/handleAsync");
const handlePagination = require('../utils/handlePagination')

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

// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|pdf/;
//         const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = fileTypes.test(file.mimetype);

//         if (extname && mimetype) {
//             cb(null, true);
//         } else {
//             cb(new ErrorClass('Only images and PDFs are allowed!', 400));
//         }
//     },
// });

const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024, // 1 MB size limit
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



module.exports = class StudentController {
 
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
                const requiredFields = [
                    'school_category', 'school_name', 'school_address', 'school_pincode',
                    'center_name', 'center_address', 'student_name', 'student_father_name',
                    'student_mother_name', 'dob_in_figures', 'dob_in_words', 'additional_subject',
                    'gender', 'caste_category', 'student_address_mohalla', 'student_address_po',
                    'student_address_sub_div', 'student_address_pin', 'student_address_ps',
                    'student_address_dist', 'student_email', 'student_mobile_number',
                    'student_aadhar_number', 'nationality', 'religion', 'handicapped',
                    'student_category', 'school_principal_email', 'school_principal_mobile',
                ];
                const { body, files } = req;
    
                const missingFields = [];
                const spaceInvalidFields = [];
    
                requiredFields.forEach((field) => {
                    if (!body[field]) {
                        missingFields.push(field);
                    } else if (body[field].trim() !== body[field]) {
                        spaceInvalidFields.push(field);
                    }
                });
    
                if (missingFields.length > 0) {
                    return next(new ErrorClass(`Missing required fields: ${missingFields.join(', ')}`, 400));
                }
    
                if (spaceInvalidFields.length > 0) {
                    return next(
                        new ErrorClass(
                            `Spaces not allowed at the beginning or end of the following fields: ${spaceInvalidFields.join(
                                ', '
                            )}`,
                            400
                        )
                    );
                }
   
                const requiredFiles = [
                    'student_photo', 'student_signature', 'parent_signature',
                    'center_signature', 'school_principal_signature',
                ];
                const missingFiles = requiredFiles.filter((file) => !files[file]);
    
                if (missingFiles.length > 0) {
                    return next(new ErrorClass(`Missing required files: ${missingFiles.join(', ')}`, 400));
                }

                if (!/^\d{10}$/.test(body.student_mobile_number)) {
                    return next(new ErrorClass('Student mobile number must be exactly 10 digits and contain only numbers.', 400));
                }
                if (!/^\d{12}$/.test(body.student_aadhar_number)) {
                    return next(new ErrorClass('Student aadhar number must be exactly 12 digits and contain only numbers.', 400));
                }
                const duplicateChecks = [
                    { field: 'student_email', value: body.student_email },
                    { field: 'student_mobile_number', value: body.student_mobile_number },
                    { field: 'student_aadhar_number', value: body.student_aadhar_number },
                ];
    
                for (const check of duplicateChecks) {
                    const existing = await studentModel.findOne({ where: { [check.field]: check.value } });
                    if (existing) {
                        return next(
                            new ErrorClass(`A student with this ${check.field.replace('_', ' ')} already exists!`, 400)
                        );
                    }
                }
    
                const newStudent = await studentModel.create({
                    ...Object.fromEntries(
                        Object.entries(body).map(([key, value]) => [key, value.trim()])
                    ), 
                    center_id: req.user.id,
                    student_photo: files.student_photo[0].path,
                    student_signature: files.student_signature[0].path,
                    parent_signature: files.parent_signature[0].path,
                    center_signature: files.center_signature[0].path,
                    school_principal_signature: files.school_principal_signature[0].path,
                });
    
                if (!newStudent) {
                    return next(new ErrorClass('Failed to create student record!', 400));
                }
    
                return new ResponseClass('Student record created successfully!', 200, newStudent).send(res);
            } catch (error) {
                next(new ErrorClass(error.message || 'Something went wrong!', 500));
            }
        }),
    ];
    

    static getStudents = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id) {
            const student = await studentModel.findOne({ where: { id } });

            if (!student) {
                return res.status(404).json({
                    message: 'Student not found!',
                    status: 'error',
                });
            }
            return new ResponseClass('Student record retrieved successfully!', 200, student).send(res);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        // Fetch students with pagination and descending order
        const { docs, pages, total, limit: paginationLimit } = await studentModel.paginate({
            page,
            paginate: limit,
            order: [['createdAt', 'DESC']], 
        });

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
        return new ResponseClass('All student records retrieved successfully!', 200, { docs, ...paginationData }).send(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || 'Something went wrong!',
            status: 'error',
        });
    }
};


    //get student by center id

    static getStudentsByCenterId = async (req, res, next) => {
        try {
            const { centerId } = req.params;

            if (centerId) {

                const students = await studentModel.findAll({ where: { center_id: centerId } });

                if (!students || students.length === 0) {
                    return res.status(404).json({
                        message: 'No students found for this center!',
                        status: 'error',
                    });
                }
                const page = parseInt(req.query.page, 10) || 1;
                const limit = parseInt(req.query.limit, 10) || 10;


                const { docs, pages, total, limit: paginationLimit } = await studentModel.paginate({ page, paginate: limit, where: { center_id: centerId },order: [['createdAt', 'DESC']],  });


                const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
                return new ResponseClass('All student records retrieved successfully!', 200, { docs, ...paginationData }).send(res)

                // return new ResponseClass('Student records retrieved successfully for this center!', 200, students).send(res);
            }

            const students = await studentModel.findAll();
            return new ResponseClass('All student records retrieved successfully!', 200, students).send(res);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || 'Something went wrong!',
                status: 'error',
            });
        }
    };

   
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
                const { id } = req.params;
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


                return new ResponseClass('Student record updated successfully!', 200, updatedStudent).send(res)
                // res.status(200).json({
                //     message: 'Student record updated successfully!',
                //     status: 'success',
                //     data: {
                //         student: updatedStudent,
                //     },
                // });
            } catch (error) {
                next(new ErrorClass(error.message || 'Something went wrong!', 500));
            }
        }),
    ];

};
