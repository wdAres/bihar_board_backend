const express = require('express');
const router = express.Router();
const TenderController = require('../controllers/tenderController');

router.post('/tenders', TenderController.createTender);
router.get('/tenders', TenderController.getAllTenders);
router.get('/tenders/:id', TenderController.getTenderById);
router.put('/tenders/:id', TenderController.updateTender);
router.delete('/tenders/:id', TenderController.deleteTender);
module.exports = router;
