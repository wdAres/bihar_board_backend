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

router
    .route('/admit-card/:id')
    .get(StudentController.getAdmitCardByStudentId)


module.exports = router;
