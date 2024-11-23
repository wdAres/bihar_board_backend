const express = require('express');
const router = express.Router();
const ImportantLinksController = require('../controllers/linksController');

router.post('/important-links', ImportantLinksController.createImportantLink);
router.get('/important-links', ImportantLinksController.getAllImportantLinks);
router.get('/important-links/:id', ImportantLinksController.getImportantLinkById);
router.put('/important-links/:id', ImportantLinksController.updateImportantLink);
// router.delete('/important-links/:id', ImportantLinksController.deleteImportantLink);

module.exports = router;
