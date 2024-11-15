const contactModel = require('../models/contactModel')
const ErrorClass = require('../utils/errorClass')
const handleAsync = require("../utils/handleAsync")


module.exports = class ContactController {
    static postContact = handleAsync(async (req, res, next) => {
        const contact = await contactModel.create(req.body)

        console.log(req.body)

        if (!contact) {
           return next(new ErrorClass('something went wrong!', 400))
        }

        res.status(200).json({
            message: 'Thank you for contacting',
            status: 'success',
            data: {
                contact
            }
        })
    })

    static getAllContacts = handleAsync(async (req, res, next) => {

        const docs = await contactModel.findAll()

        res.status(200).json({
            status: 'success',
            data: {
                docs
            }
        })

    })
}