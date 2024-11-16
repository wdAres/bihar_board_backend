const CenterController = require("../controllers/centerController");
const { protectedRoute, authorizedRoute } = require("../utils/handleToken");
const router = require('express').Router()

router.use(protectedRoute,authorizedRoute('admin'))

router.get('/' , CenterController.getAllCenters)

module.exports = router
