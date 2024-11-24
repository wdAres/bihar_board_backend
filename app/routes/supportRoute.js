const express = require('express');
const SupportController = require('../controllers/supportController');
const router = express.Router();

// router.use(protectedRoute,authorizedRoute('admin','center'))
// 

// router.post('/', SupportController.postSupport);
// router.get('/center', SupportController.particularCenterTickets);
// router.get('/', SupportController.getAllSupports);
// router.put('/:id', SupportController.updateSupport);

router
    .route('/')
    .get(SupportController.getDocuments)
    .post(SupportController.addDocument)


router
    .route('/:id')
    .get(SupportController.getDocument)
    .patch(SupportController.updateDocument)
    .delete(SupportController.deleteDocument);

module.exports = router;
