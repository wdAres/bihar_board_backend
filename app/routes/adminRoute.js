const express = require('express');
const AdminController = require('../controllers/adminController'); 
const router = express.Router();

router.post('/signup', AdminController.createAdmin);
router.post('/login', AdminController.loginAdmin);

module.exports = router;
