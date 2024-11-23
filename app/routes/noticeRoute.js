const NoticeController = require('../controllers/noticeController');
const { protectedRoute, authorizedRoute } = require('../utils/handleToken');
const router = require('express').Router();

router.use(protectedRoute , authorizedRoute('admin','center'))

router
    .route('/notices')
    .post(NoticeController.createNotice)
    .get(NoticeController.getAllNotices);

router
    .route('/notices/:id')
    .get(NoticeController.getNoticeById)
    .patch(NoticeController.updateNotice)
    .delete(NoticeController.deleteNotice);

module.exports = router;
