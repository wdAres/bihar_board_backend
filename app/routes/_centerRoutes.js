const { protectedRoute, authorizedRoute } = require('../utils/handleToken')
const centerRouter = require('./centerRoute')
const authRouter = require('./authRoute')
const supportRouter = require('./supportRoute')
const studentRouter = require('./studentRoute')
const AdmitCardController = require('../controllers/admitCardController')
const router = require('express').Router()


router.use('/auth', authRouter)

router.use(protectedRoute, authorizedRoute('center'))

router.use('/center', centerRouter)
router.use('/support', supportRouter)
router.use('/student', studentRouter)
router.post('/generate-admit-card' , AdmitCardController.addDocument)
router.post('/generate-admit-cards', AdmitCardController.generateAdmitCardsForAll);



module.exports = router