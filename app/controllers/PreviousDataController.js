const previousDataModel = require('../models/previousModel');
const UniversalController = require('./universalController');

module.exports = class PreviousDataController extends UniversalController {
   
    static getDocument = UniversalController.getDocuments(previousDataModel);
    static deleteDocument = UniversalController.deleteDocument(previousDataModel);

    static async getDataById(req, res) {
        try {
            const data = await previousDataModel.findByPk(req.params.id);
            if (!data) {
                return res.status(404).json({ error: 'Data not found' });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

