const SchoolPropertyController = require('../controllers/schoolPropertyController')
const router = require('express').Router()

router
      .route('/')
      .post(SchoolPropertyController.addDocument)
      .get(SchoolPropertyController.getDocuments)
      

router
    .route('/:id')
    .get(SchoolPropertyController.getDocument)
    .patch(SchoolPropertyController.updateDocument)
    .delete( SchoolPropertyController.deleteDocument)

router
    .route('/center/true')
    .get(SchoolPropertyController.getDocumentsByCenter)


router
    .route('/center/:id')
    .get(SchoolPropertyController.getPropertyByCenter)
    
module.exports = router