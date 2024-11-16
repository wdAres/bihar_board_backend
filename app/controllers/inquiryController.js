const inquiryModel = require('../models/inquiryModel')
const ErrorClass = require('../utils/errorClass')
const handleAsync = require("../utils/handleAsync")
const ResponseClass = require('../utils/ResponseClass')
const handlePagination = require('../utils/handlePagination')
module.exports = class InquiryController {
    static postInquiry = handleAsync(async (req, res, next) => {
        const inquiry = await inquiryModel.create(req.body)


        if (!inquiry) {
           return next(new ErrorClass('something went wrong!', 400))
        }

        // res.status(200).json({
        //     message: 'We will rwach soon!',
        //     status: 'success',
        //     data: {
        //         inquiry
        //     }
        // })
        return new ResponseClass('Thank you for inquiry', 200, inquiry).send(res)
    })

    static getAllInquiries = handleAsync(async (req, res, next) => {

        // const docs = await inquiryModel.findAll()

        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         docs
        //     }
        // })
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        // Paginate the users
        const { docs, pages, total, limit: paginationLimit } = await inquiryModel.paginate({ page, paginate:limit });


        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


        return new ResponseClass('All inquiry data', 200, { docs, ...paginationData }).send(res)
        
    })
}