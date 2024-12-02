const linksModel = require('../models/linksModel');
const handleAsync = require('../utils/handleAsync');
const UniversalController = require('./universalController');

module.exports = class LinkController extends UniversalController {
    static addDocument = UniversalController.addDocument(linksModel);
    static getDocuments = [handleAsync(async (req, res, next) => {
        const searchParams = ['label'];
        UniversalController.getDocuments(linksModel, {}, [], searchParams)(req, res, next);
    })];
    static getDocument = UniversalController.getDocument(linksModel)
    static deleteDocument = UniversalController.deleteDocument(linksModel)
    static updateDocument = UniversalController.updateDocument(linksModel)
};
