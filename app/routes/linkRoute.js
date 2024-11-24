const LinkController = require('../controllers/linkController');
const router = require('express').Router();


router
    .route('/')
    .get(LinkController.getDocuments)
    .post(LinkController.addDocument)


router
    .route('/:id')
    .get(LinkController.getDocument)
    .patch(LinkController.updateDocument)
    .delete(LinkController.deleteDocument);

module.exports = router;
