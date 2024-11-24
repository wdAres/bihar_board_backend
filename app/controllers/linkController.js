const linksModel = require('../models/linksModel');
const UniversalController = require('./universalController');

module.exports = class LinkController extends UniversalController {
    static addDocument = UniversalController.addDocument(linksModel);
    static getDocuments = UniversalController.getDocuments(linksModel)
    static getDocument = UniversalController.getDocument(linksModel)
    static deleteDocument = UniversalController.deleteDocument(linksModel)
    static updateDocument = UniversalController.updateDocument(linksModel)
};
