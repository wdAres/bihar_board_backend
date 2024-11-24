const supportModel = require('../models/supportModel');
const UniversalController = require('./universalController');

const keyMiddleware = (req,res,next)=>{
    if (req.user) {
        req.body.center_id = req.user.id
    }
    next()
}

const markResolveMiddleware = (req,res,next)=>{
    req.body = {
        status:'resolved'
    }
    next()
}


module.exports = class SupportController  extends UniversalController {
    static addDocument = [keyMiddleware, UniversalController.addDocument(supportModel)];
    static getDocuments = UniversalController.getDocuments(supportModel)
    static getDocument = UniversalController.getDocument(supportModel)
    static deleteDocument = UniversalController.deleteDocument(supportModel)
    static updateDocument = [markResolveMiddleware , UniversalController.updateDocument(supportModel)]
};
