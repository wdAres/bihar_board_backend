const AuthController = require("../controllers/authController");
const { authorizedRoute, protectedRoute } = require("../utils/handleToken");
const router = require('express').Router()



router.post('/login', AuthController.loginUser);
<<<<<<< HEAD
router.post('/signup' , AuthController.createSchool);

=======

// router.use(protectedRoute,authorizedRoute('admin'))

router.post('/signup' , AuthController.createUser);
>>>>>>> c335bf222945596d19333b0eb2fc2e2c74947a6c

module.exports = router