const { protectedRoute, authorizedRoute } = require('../utils/handleToken')
const centerRouter = require('./centerRoute')
const authRouter = require('./authRoute')
const supportRouter = require('./supportRoute')
const studentRouter = require('./studentRoute')
const router = require('express').Router()


router.use('/auth', authRouter)

router.use(protectedRoute, authorizedRoute('center'))

router.use('/center', centerRouter)
router.use('/support', supportRouter)
router.use('/student', studentRouter)



module.exports = router