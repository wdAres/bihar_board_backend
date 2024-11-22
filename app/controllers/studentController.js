const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const ErrorClass = require('../utils/errorClass');
const UniversalController = require('./universalController');
const handleAsync = require('../utils/handleAsync');

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
        return next(new ErrorClass('Admin dosnt have this authority',401))
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
    static getDocuments  = [handleAsync(async (req, res, next) => {
        const includeArr = [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]; 
        UniversalController.getDocuments(studentModel,{}, includeArr)(req, res, next);
    })];
    static getDocument = [handleAsync(async (req, res, next) => {
        const includeArr = [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]; 
        await UniversalController.getDocument(studentModel,{}, includeArr)(req, res, next);
    })];
    static deleteDocument = UniversalController.deleteDocument(studentModel)
    static updateDocument = [uploadFields, fileupdateMiddleware, UniversalController.updateDocument(studentModel)]
    static getDocumentsByCenter = [
        handleAsync(async (req, res, next) => { await UniversalController.getDocuments(studentModel, { center_id: req.params.id })(req, res, next); })
    ]

    // static createStudent = [
    //     upload.fields([
    //         { name: 'student_photo', maxCount: 1 },
    //         { name: 'student_signature', maxCount: 1 },
    //         { name: 'parent_signature', maxCount: 1 },

    //     ]),

    //     handleAsync(async (req, res, next) => {
    //         try {
    //             const { body, files } = req;

    //             console.log(req.user.id)

    //             const requiredFiles = ['student_photo', 'student_signature', 'parent_signature'];
    //             const missingFiles = requiredFiles.filter(file => !files[file]);
    //             if (missingFiles.length > 0) {
    //                 return next(new ErrorClass(`Missing required files: ${missingFiles.join(', ')}`, 400));
    //             }

    //             const newStudent = await studentModel.create({
    //                 ...Object.fromEntries(Object.entries(body).map(([key, value]) => [key, value.trim()])),
    //                 center_id: req.user.id,
    //                 student_photo: `${baseUrl}/${files.student_photo[0].filename}`,
    //                 student_signature: `${baseUrl}/${files.student_signature[0].filename}`,
    //                 parent_signature: `${baseUrl}/${files.parent_signature[0].filename}`,

    //             });

    //             if (!newStudent) {
    //                 return next(new ErrorClass('Failed to create student record!', 400));
    //             }

    //             return new ResponseClass('Student created successfully!', 200, newStudent).send(res);
    //         } catch (error) {
    //             next(new ErrorClass(error.message || 'Something went wrong!', 500));
    //         }
    //     })
    // ];

    // static getStudents = handleAsync(async (req, res, next) => {
    //     const { id } = req.params;

    //     if (id) {
    //         const student = await studentModel.findOne({
    //             where: { id },
    //             include: [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]
    //         });

    //         if (!student) {
    //             return res.status(404).json({
    //                 message: 'Student not found!',
    //                 status: 'error',
    //             });
    //         }
    //         return new ResponseClass('Student record retrieved successfully!', 200, student).send(res);
    //     }

    //     const page = parseInt(req.query.page, 10) || 1;
    //     const limit = parseInt(req.query.limit, 10) || 10;

    //     const { docs, pages, total, limit: paginationLimit } = await studentModel.paginate({
    //         page,
    //         paginate: limit,
    //         order: [['createdAt', 'DESC']],
    //         include: [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]
    //     });

    //     const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
    //     return new ResponseClass('All student records retrieved successfully!', 200, { docs, ...paginationData }).send(res);
    // });


    // static deleteStudent = async (req, res, next) => {


    //     const { id } = req.params


    //     const doc = await studentModel.destroy({ where: { id: id } });

    //     if (!doc) {
    //         return next(new ErrorClass('Student not found!', 404));
    //     }

    //     return new ResponseClass(`Document Deleted`, 200, null).send(res)


    //     // return new ResponseClass('Student records retrieved successfully for this center!', 200, students).send(res);
    // }

    // // static getStudentsByCenterId = async (req, res, next) => {
    // //     try {
    // //         const { centerId } = req.params;

    // //         if (centerId) {

    // //             const students = await studentModel.findAll({ where: { center_id: centerId } });

    // //             const page = parseInt(req.query.page, 10) || 1;
    // //             const limit = parseInt(req.query.limit, 10) || 10;


    // //             const { docs, pages, total, limit: paginationLimit } = await studentModel.paginate({ 
    // //                 page, 
    // //                 paginate: limit,
    // //                 where: { center_id: centerId }, 
    // //                 order: [['createdAt', 'DESC']],
    // //                 include: [{ model: userModel, as: 'center' ,attributes: { exclude: ['password'] }}]
    // //              });


    // //             const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
    // //             return new ResponseClass('All student records retrieved successfully!', 200, { docs, ...paginationData }).send(res)

    // //         }

    // //         const students = await studentModel.findAll();
    // //         return new ResponseClass('All student records retrieved successfully!', 200, students).send(res);

    // //     } catch (error) {
    // //         console.error(error);
    // //         res.status(500).json({
    // //             message: error.message || 'Something went wrong!',
    // //             status: 'error',
    // //         });
    // //     }
    // // };

    // static getStudentsByCenterId = async (req, res, next) => {
    //     try {
    //         const { centerId } = req.params;

    //         if (centerId) {
    //             const page = parseInt(req.query.page, 10) || 1;
    //             const limit = parseInt(req.query.limit, 10) || 10;
    //             const searchQuery = req.query.search || '';
    //             const dateFilter = req.query.date; // Get the date filter from the query parameters

    //             // Build the where clause
    //             const whereClause = { center_id: centerId };

    //             if (searchQuery) {
    //                 whereClause[Sequelize.Op.or] = [{ student_name: { [Sequelize.Op.iLike]: `%${searchQuery}%` } }
    //                     , { student_father_name: { [Sequelize.Op.iLike]: `%${searchQuery}%` } }
    //                     , { student_mother_name: { [Sequelize.Op.iLike]: `%${searchQuery}%` } }];
    //             }

    //             if (!!dateFilter) {
    //                 // Convert the date filter to a date object
    //                 const filterDate = new Date(dateFilter);
    //                 const nextDay = new Date(filterDate);
    //                 nextDay.setDate(nextDay.getDate() + 1);

    //                 // Use the start of the day and the start of the next day to filter for a single date
    //                 whereClause.createdAt = {
    //                     [Sequelize.Op.gte]: filterDate,
    //                     [Sequelize.Op.lt]: nextDay
    //                 };
    //             }

    //             const { docs, pages, total, limit: paginationLimit } = await studentModel.paginate({
    //                 page,
    //                 paginate: limit,
    //                 where: whereClause,
    //                 order: [['createdAt', 'DESC']],
    //                 include: [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]
    //             });

    //             const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
    //             return new ResponseClass('All student records retrieved successfully!', 200, { docs, ...paginationData }).send(res);
    //         }

    //         const students = await studentModel.findAll();
    //         return new ResponseClass('All student records retrieved successfully!', 200, students).send(res);

    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: error.message || 'Something went wrong!',
    //             status: 'error',
    //         });
    //     }
    // };


    // static updateStudent = [
    //     upload.fields([
    //         { name: 'student_photo', maxCount: 1 },
    //         { name: 'student_signature', maxCount: 1 },
    //         { name: 'parent_signature', maxCount: 1 },
    //         { name: 'center_signature', maxCount: 1 },
    //         { name: 'school_principal_signature', maxCount: 1 },
    //     ]),

    //     handleAsync(async (req, res, next) => {
    //         const { id } = req.params;
    //         const { student_email, student_mobile_number, student_aadhar_number, ...updateData } = req.body;
    //         const files = req.files;

    //         if (!student_email || !student_mobile_number || !student_aadhar_number) {
    //             return next(new ErrorClass('Email, Mobile, and Aadhar are required!', 400));
    //         }

    //         const existingStudent = await studentModel.findOne({
    //             where: {
    //                 [Op.or]: [
    //                     { student_email },
    //                     { student_aadhar_number },
    //                 ],
    //                 id: { [Op.ne]: id },
    //             },
    //         });

    //         if (existingStudent) {
    //             return next(new ErrorClass('Student with this email or Aadhar already exists!', 400));
    //         }

    //         const student = await studentModel.findByPk(id);
    //         if (!student) return next(new ErrorClass('Student not found!', 404));

    //         const updatedData = {
    //             ...updateData,
    //             student_photo: files?.student_photo?.[0]?.path || student.student_photo,
    //             student_signature: files?.student_signature?.[0]?.path || student.student_signature,
    //             parent_signature: files?.parent_signature?.[0]?.path || student.parent_signature,
    //             center_signature: files?.center_signature?.[0]?.path || student.center_signature,
    //             school_principal_signature: files?.school_principal_signature?.[0]?.path || student.school_principal_signature,
    //         };

    //         const updatedStudent = await student.update(updatedData);
    //         return new ResponseClass('Student updated successfully!', 200, updatedStudent).send(res);
    //     }),
    // ];


};