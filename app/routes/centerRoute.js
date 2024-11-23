const multer = require("multer");
const CenterController = require("../controllers/centerController");
const { protectedRoute, authorizedRoute } = require("../utils/handleToken");
const path = require('path')
const ErrorClass = require("../utils/ErrorClass");
const router = require('express').Router()

// router.use(protectedRoute,authorizedRoute('admin','a'))
const uploadDir = path.join(__dirname, '../uploads/school');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Define your upload directory 
    }, filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);

    }
}); // File filter to validate file type and size 
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) { cb(null, true); }
    else {
        cb(new ErrorClass('Only JPEG, JPG, and PNG files under 1 MB are allowed!', 400));
    }
}; // Initialize multer with storage settings and file filter 
const upload = multer({
    storage, 
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB 
    fileFilter
});

router.get('/', CenterController.getAllCenters)
router.get('/details', protectedRoute, authorizedRoute('center'), CenterController.getDetails)
router.patch('/details', protectedRoute, authorizedRoute('center'), upload.single('school_principal_signature'), CenterController.updateDetails)
router.get('/:id', CenterController.getCenterById);
router.delete('/:id', CenterController.deleteCenterById);
module.exports = router
