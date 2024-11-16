const StudentController = require('../controllers/studentController');
const { protectedRoute, authorizedRoute } = require('../utils/handleToken');
const router = require('express').Router();

router.use(protectedRoute,authorizedRoute('admin','center'))

router
    .route('/students')
    .post(StudentController.createStudent) 
    // .get(protectedRoute, authorizedRoute('admin'), StudentController.getAllStudents); 
    router.get('/students', StudentController.getStudents);

    // Route to get a single student by ID
    router.get('/students/:id', StudentController.getStudents);
    router.put('/students/:id', StudentController.updateStudent);
module.exports = router;