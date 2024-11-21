const inquiryModel = require('../models/inquiryModel')
const ErrorClass = require('../utils/ErrorClass')
const handleAsync = require("../utils/handleAsync")
const ResponseClass = require('../utils/ResponseClass')
const handlePagination = require('../utils/handlePagination')
module.exports = class InquiryController {
    static postInquiry = handleAsync(async (req, res, next) => {
            const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
            const { body } = req;
    
            const missingFields = [];
    
            requiredFields.forEach((field) => {
                if (!body[field]) {
                    missingFields.push(field);
                }
            });
    
            if (missingFields.length > 0) {
                return next(
                    new ErrorClass(`Missing required fields: ${missingFields.join(', ')}`, 400)
                );
            }
            if (!/^\d{10}$/.test(body.phone)) {
                return next(new ErrorClass('Phone number must be exactly 10 digits and contain only numbers.', 400));
            }
    
            const inquiry = await inquiryModel.create({
                ...Object.fromEntries(
                    Object.entries(body).map(([key, value]) => [key, value.trim()])
                ), 
            });
    
            if (!inquiry) {
                return  new ErrorClass(res.message  || 'Something went wrong!' , 400);
            }
    
            return new ResponseClass('Thank you for your inquiry', 200, {inquiry}).send(res);
    });

    static getAllInquiries = handleAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await inquiryModel.paginate({ page, paginate: limit });

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });

        return new ResponseClass('All inquiry data', 200, { docs, ...paginationData }).send(res);
    });
}
