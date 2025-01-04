const employeeController = require('../controllers/employeeController')
const router = require('express').Router()

router
      .route('/')
      .post(employeeController.addDocument)
      .get(employeeController.getDocument)
      

router
    .route('/:id')
    .patch(employeeController.updateDocument)
    .delete( employeeController.deleteDocument)
router
    .route('/center/true')
    .get(employeeController.getDocumentsByCenter)


router
    .route('/center/:id')
    .get(employeeController.getEmployeeByCenter)

module.exports = router