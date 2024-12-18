const SchoolPropertyController = require('../controllers/schoolPropertyController')
const router = require('express').Router()

router
      .route('/')
      .post(SchoolPropertyController.addDocument)
      

router
    .route('/:id')
    .get(SchoolPropertyController.getDocument)
    .patch(SchoolPropertyController.updateDocument)
    .delete( SchoolPropertyController.deleteDocument)

router
    .route('/center/true')
    .get(SchoolPropertyController.getDocumentsByCenter)
    
module.exports = router