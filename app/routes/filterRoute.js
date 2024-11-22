const express = require('express');
const router = express.Router();
const StudentFilter = require('../controllers/filterData');
const CenterFilter = require('../controllers/filterData');

router.post('/filter-students-by-date', StudentFilter.filterStudentsByDate);
router.post('/filter-centers-by-date', CenterFilter.filterCentersByDate)
router.post('/searchStudent', StudentFilter.searchByStudetName);
router.post('/searchCenter', CenterFilter.searchByCenterName);
router.get('/download-centers-xls', CenterFilter.downloadCentersXLS);
router.get('/download-students-xls', StudentFilter.downloadStudentsXLS);
module.exports = router;
