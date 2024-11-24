const multer = require("multer");
const CenterController = require("../controllers/centerController");
const { protectedRoute, authorizedRoute } = require("../utils/handleToken");
const path = require('path')
const ErrorClass = require("../utils/ErrorClass");
const router = require('express').Router()


router.get('/', CenterController.getDocuments)
router.post('/', CenterController.addDocument);
router.get('/:id', CenterController.getDocument);
router.delete('/:id', CenterController.deleteDocument);
router.patch('/:id', CenterController.updateDocument);


module.exports = router