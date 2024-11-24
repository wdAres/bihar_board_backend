const NoticeController = require('../controllers/noticeController');
const { protectedRoute, authorizedRoute } = require('../utils/handleToken');
const router = require('express').Router();


router
    .route('/')
    .get(NoticeController.getDocuments)
    .post(NoticeController.addDocument)


router
    .route('/:id')
    .get(NoticeController.getDocument)
    .patch(NoticeController.updateDocument)
    .delete(NoticeController.deleteDocument);

module.exports = router;
