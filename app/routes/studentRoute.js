const StudentController = require('../controllers/studentController');
const { protectedRoute, authorizedRoute } = require('../utils/handleToken');
const router = require('express').Router();

router.use(protectedRoute, authorizedRoute('center'))

router
    .route('/students')
    .post(StudentController.createStudent)
// .get(protectedRoute, authorizedRoute('admin'), StudentController.getAllStudents); 
router.get('/students', StudentController.getStudents);
router.get('/students/center/:centerId', StudentController.getStudentsByCenterId);

router.get('/students/:id', StudentController.getStudents);
router.put('/students/:id', StudentController.updateStudent);
router.delete('/students/:id', StudentController.deleteStudent);

module.exports = router;
