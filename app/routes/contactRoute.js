const InquiryController = require('../controllers/inquiryController')
const router = require('express').Router()

router.route('/').post(InquiryController.addDocument).get(InquiryController.getDocuments)


module.exports = router