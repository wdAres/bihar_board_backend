const inquiryModel = require('../models/inquiryModel');
const handleAsync = require('../utils/handleAsync');
const UniversalController = require('./universalController')

module.exports = class InquiryController extends UniversalController {
    static addDocument = UniversalController.addDocument(inquiryModel)
    static getDocuments = [handleAsync(async (req, res, next) => {
        const searchParams = ['name','email','message','phone','subject'];
        UniversalController.getDocuments(inquiryModel, {}, [], searchParams)(req, res, next);
    })];
}
