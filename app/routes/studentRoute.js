const StudentController = require('../controllers/studentController');
const router = require('express').Router();

router
    .route('/')
    .get(StudentController.getDocuments)
    .post(StudentController.addDocument)


router
    .route('/:id')
    .get(StudentController.getDocument)
    .patch(StudentController.updateDocument)
    .delete(StudentController.deleteDocument);

router
    .route('/center/:id')
    .get(StudentController.getDocumentsByCenter)

// router
//     .route('/students')
//     .post(StudentController.createStudent)
// // .get(protectedRoute, authorizedRoute('admin'), StudentController.getAllStudents); 
// router.get('/students', StudentController.getStudents);
// router.get('/students/center/:centerId', StudentController.getStudentsByCenterId);

// router.get('/students/:id', StudentController.getStudents);
// router.put('/students/:id', StudentController.updateStudent);
// router.delete('/students/:id', StudentController.deleteStudent);

module.exports = router;
