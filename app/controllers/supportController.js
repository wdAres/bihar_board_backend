const supportModel = require('../models/supportModel');
const ResponseClass = require('../utils/ResponseClass');
const ErrorClass = require('../utils/ErrorClass');
const handleAsync = require('../utils/handleAsync');
const handlePagination = require('../utils/handlePagination');

module.exports = class SupportController {
    static postSupport = handleAsync(async (req, res, next) => {
        const support = await supportModel.create({ ...req.body, center_id: req.user.id });

        if (!support) {
            throw new Error('Something went wrong!');
        }

        return new ResponseClass('Support ticket created successfully', 200, support).send(res);
    });

    static getAllSupports = handleAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await supportModel.paginate({ page, paginate: limit });

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });

        return new ResponseClass('All support tickets fetched successfully', 200, { docs, ...paginationData }).send(res);
    });

    static particularCenterTickets = handleAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const center_id = req.user.id

        const { docs, pages, total, limit: paginationLimit } = await supportModel.paginate({ where: { center_id } , page, paginate: limit });

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });

        return new ResponseClass('Support tickets fetched successfully', 200, { docs, ...paginationData }).send(res);
    });

    static updateSupport = handleAsync(async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;

        const support = await supportModel.findByPk(id);
        if (!support) {
            return next(new ErrorClass('Support ticket not found', 404));
        }

        support.status = status || support.status;
        await support.save();

        return new ResponseClass('Support ticket updated successfully', 200, support).send(res);
    });
};
