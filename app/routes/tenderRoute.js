const express = require('express');
const router = express.Router();
const TenderController = require('../controllers/tenderController');

router
    .route('/')
    .get(TenderController.getDocuments)
    .post(TenderController.addDocument)


router
    .route('/:id')
    .get(TenderController.getDocument)
    .patch(TenderController.updateDocument)
    .delete(TenderController.deleteDocument);

module.exports = router;
