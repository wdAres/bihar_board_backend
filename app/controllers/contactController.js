const contactModel = require('../models/contactModel')
const ErrorClass = require('../utils/ErrorClass')
const handleAsync = require("../utils/handleAsync")
const handlePagination = require('../utils/handlePagination')
const ResponseClass = require('../utils/ResponseClass')



module.exports = class ContactController {

    static postContact = handleAsync(async (req, res, next) => {
        const contact = await contactModel.create(req.body)

        if (!contact) {
            return next(new ErrorClass('something went wrong!', 400))
        }

        return new ResponseClass('Thank you for contacting', 200, contact).send(res)

    })

    static getAllContacts = handleAsync(async (req, res, next) => {

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        // Paginate the users
        const { docs, pages, total, limit: paginationLimit } = await contactModel.paginate({ page, paginate:limit });


        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


        return new ResponseClass('All contacts data', 200, { docs, ...paginationData }).send(res)

    })
}