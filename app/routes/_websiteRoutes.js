const inquiryRouter = require('./contactRoute')
const noticeRouter = require('./noticeRoute')
const tenderRouter = require('./tenderRoute')
const linkRouter = require('./linkRoute')
const StudentController = require('../controllers/studentController')
const CenterController = require('../controllers/centerController')
const router = require('express').Router()

router.use('/inquiry' , inquiryRouter)
router.use('/notice' , noticeRouter)
router.use('/tender' , tenderRouter)
router.use('/important-link' , linkRouter)
router.use('/total_students',StudentController.totalStudents)
router.use('/total_schools',CenterController.totalSchools)


module.exports = router