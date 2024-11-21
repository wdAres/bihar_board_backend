const express = require('express');
const SupportController = require('../controllers/supportController');
const { protectedRoute ,authorizedRoute} = require('../utils/handleToken');
const router = express.Router();

router.use(protectedRoute,authorizedRoute('admin','center'))
// 

router.post('/', SupportController.postSupport);
router.get('/', SupportController.getAllSupports);
router.put('/:id', SupportController.updateSupport);

module.exports = router;
