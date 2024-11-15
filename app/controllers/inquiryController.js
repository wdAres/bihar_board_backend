const inquiryModel = require('../models/inquiryModel')
const ErrorClass = require('../utils/errorClass')
const handleAsync = require("../utils/handleAsync")


module.exports = class InquiryController {
    static postInquiry = handleAsync(async (req, res, next) => {
        const inquiry = await inquiryModel.create(req.body)


        if (!inquiry) {
           return next(new ErrorClass('something went wrong!', 400))
        }

        res.status(200).json({
            message: 'We will rwach soon!',
            status: 'success',
            data: {
                inquiry
            }
        })
    })

    static getAllInquiries = handleAsync(async (req, res, next) => {

        const docs = await inquiryModel.findAll()

        res.status(200).json({
            status: 'success',
            data: {
                docs
            }
        })
        
    })
}