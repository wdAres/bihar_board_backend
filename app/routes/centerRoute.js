const CenterController = require("../controllers/centerController");
const router = require('express').Router()

router.get('/centers' , CenterController.getAllCenters)

module.exports = router
