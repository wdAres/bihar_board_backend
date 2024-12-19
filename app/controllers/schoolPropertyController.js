const SchoolPropertyModel = require('../models/SchoolPropertyModel');
const handleAsync = require('../utils/handleAsync');
const UniversalController = require('./universalController')
const keyMiddleware = (req, res, next) => {
    if (req.user) {
        req.body.center_id = req.user.id
    }
    next()
}


module.exports = class SchoolPropertyController extends UniversalController {
    static addDocument = [keyMiddleware,UniversalController.addDocument(SchoolPropertyModel)]
    // static getDocument = UniversalController.getDocument(SchoolPropertyModel)
    static getDocuments = UniversalController.getDocuments(SchoolPropertyModel)
    static deleteDocument = UniversalController.deleteDocument(SchoolPropertyModel)
    static updateDocument =  UniversalController.updateDocument(SchoolPropertyModel)
    static getDocumentsByCenter = [handleAsync(async (req, res, next) => {
        req.params.id = req.user.id;
        const searchParams = ['status'];
        UniversalController.getDocuments(SchoolPropertyModel, { center_id: req.params.id }, [], searchParams)(req, res, next);
    })];

    static getPropertyByCenter = [
        handleAsync(async (req, res, next) => { await UniversalController.getDocuments(SchoolPropertyModel, { center_id: req.params.id })(req, res, next); })
    ]
}
