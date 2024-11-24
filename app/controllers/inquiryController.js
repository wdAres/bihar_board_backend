const inquiryModel = require('../models/inquiryModel')
const UniversalController = require('./universalController')

module.exports = class InquiryController extends UniversalController {
    static addDocument = UniversalController.addDocument(inquiryModel)
    static getDocuments = UniversalController.getDocuments(inquiryModel)
}
