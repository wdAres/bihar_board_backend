const centerRouter = require('./centerRoute')
const inquiryRouter = require('./contactRoute')
const authRouter = require('./adminRoute')
const noticeRouter = require('./noticeRoute')
const tenderRouter = require('./tenderRoute')
const linkRouter = require('./linkRoute')
const supportRouter = require('./supportRoute')
const studentRouter = require('./studentRoute')
const employeeRouter = require('./employeeRoutes')
const SchoolProperty = require('./PropertyRoutes')
const { protectedRoute, authorizedRoute } = require('../utils/handleToken')
const AdmitCardController = require('../controllers/admitCardController')
const router = require('express').Router();


router.use('/auth',authRouter)

router.use(protectedRoute , authorizedRoute('admin'))

router.use('/center' , centerRouter)
router.use('/inquiry' , inquiryRouter)
router.use('/notice' , noticeRouter)
router.use('/tender' , tenderRouter)
router.use('/important-link' , linkRouter)
router.use('/support' , supportRouter)
router.use('/student' , studentRouter)
router.use('/Employee', employeeRouter)
router.use('/Property', SchoolProperty)
router.post('/generate-admit-card' , AdmitCardController.addDocument)
router.post('/generate-admit-cards', AdmitCardController.generateAdmitCardsForAll);


module.exports = router