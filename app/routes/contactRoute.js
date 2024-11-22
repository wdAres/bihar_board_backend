const ContactController = require('../controllers/contactController')
const InquiryController = require('../controllers/inquiryController')
const { protectedRoute, authorizedRoute } = require('../utils/handleToken')
const router = require('express').Router()

// router.route('/contact').post(ContactController.postContact).get(protectedRoute, authorizedRoute('admin'), ContactController.getAllContacts)

router.route('/inquiry').post(InquiryController.postInquiry).get(protectedRoute, authorizedRoute('admin'), InquiryController.getAllInquiries)

module.exports = router