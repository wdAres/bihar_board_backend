const inquiryRouter = require('./contactRoute')
const noticeRouter = require('./noticeRoute')
const tenderRouter = require('./tenderRoute')
const linkRouter = require('./linkRoute')
const router = require('express').Router()

router.use('/inquiry' , inquiryRouter)
router.use('/notice' , noticeRouter)
router.use('/tender' , tenderRouter)
router.use('/important-link' , linkRouter)



module.exports = router