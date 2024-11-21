const express = require('express');
const AdminController = require('../controllers/adminController'); 
const router = express.Router();
// const { protectedRoute, authorizedRoute } = require("../utils/handleToken");

router.post('/signup', AdminController.createAdmin);

router.post('/login', AdminController.loginAdmin);

// router.use(protectedRoute,authorizedRoute('admin'))

module.exports = router;
