const linkModel = require('../models/linksModel');
const UniversalController = require('./universalController');

module.exports = class LinkController extends UniversalController {
    static addDocument = UniversalController.addDocument;
    static getDocuments = UniversalController.getDocuments(linkModel)
    static getDocument = UniversalController.getDocument(linkModel)
    static deleteDocument = UniversalController.deleteDocument(linkModel)
    static updateDocument = UniversalController.updateDocument
};
