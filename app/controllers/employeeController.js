const employeeModel = require('../models/employeeModel');
const handleAsync = require('../utils/handleAsync');
const UniversalController = require('./universalController')

const keyMiddleware = (req, res, next) => {
    if (req.user) {
        req.body.center_id = req.user.id
    }
    next()
}

module.exports = class employeeController extends UniversalController {
    static addDocument = [keyMiddleware,UniversalController.addDocument(employeeModel)]
    static getDocument = UniversalController.getDocuments(employeeModel)
    static deleteDocument = UniversalController.deleteDocument(employeeModel)
    static updateDocument =  UniversalController.updateDocument(employeeModel)

    static getDocumentsByCenter = [handleAsync(async (req, res, next) => {
        req.params.id = req.user.id;
        const searchParams = ['status'];
        UniversalController.getDocuments(employeeModel, { center_id: req.params.id }, [], searchParams)(req, res, next);
    })];

    static getEmployeeByCenter = [
        handleAsync(async (req, res, next) => { await UniversalController.getDocuments(employeeModel, { center_id: req.params.id })(req, res, next); })
    ]
    
}
