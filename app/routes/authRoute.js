const AuthController = require("../controllers/authController");
const { authorizedRoute, protectedRoute } = require("../utils/handleToken");
const router = require('express').Router()

router.post('/login', AuthController.loginUser);
router.post('/signup', protectedRoute , authorizedRoute('admin'), AuthController.createUser);

module.exports = router