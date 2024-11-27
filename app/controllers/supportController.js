const supportModel = require('../models/supportModel');
const handleAsync = require('../utils/handleAsync');
const UniversalController = require('./universalController');

const keyMiddleware = (req, res, next) => {
    if (req.user) {
        req.body.center_id = req.user.id
    }
    next()
}

const markResolveMiddleware = (req, res, next) => {
    req.body = {
        status: 'resolved'
    }
    next()
}


module.exports = class SupportController extends UniversalController {
    static addDocument = [keyMiddleware, UniversalController.addDocument(supportModel)];
    static getDocuments = [handleAsync(async (req, res, next) => {
        const searchParams = ['status'];
        UniversalController.getDocuments(supportModel, {}, [], searchParams)(req, res, next);
    })]; 
    // static getDocuments = UniversalController.getDocuments(supportModel)
    static getDocument = UniversalController.getDocument(supportModel)
    static deleteDocument = UniversalController.deleteDocument(supportModel)
    static updateDocument = [markResolveMiddleware, UniversalController.updateDocument(supportModel)]
    // static getDocumentsByCenter = [
    //     handleAsync(async (req, res, next) => { req.params.id = req.user.id ;  await UniversalController.getDocuments(supportModel, { center_id: req.params.id })(req, res, next); })
    // ]
    static getDocumentsByCenter = [handleAsync(async (req, res, next) => {
        req.params.id = req.user.id;
        const searchParams = ['status'];
        UniversalController.getDocuments(supportModel, { center_id: req.params.id }, [], searchParams)(req, res, next);
    })];

};
