const supportModel = require('../models/supportModel');
const ResponseClass = require('../utils/ResponseClass');
const ErrorClass = require('../utils/ErrorClass');
const handleAsync = require('../utils/handleAsync');
const handlePagination = require('../utils/handlePagination');
const { Sequelize } = require('sequelize');

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
        const searchQuery = req.query.search || '';
        const dateFilter = req.query.date; // Get the date filter from the query parameters

        // Build the where clause
        const whereClause = {};

        if (searchQuery) {
            whereClause[Sequelize.Op.or] = [
                { subject: { [Sequelize.Op.iLike]: `%${searchQuery}%` } },
                { id:parseInt(searchQuery) }
                // { id: { [Sequelize.Op.iLike]: `%${searchQuery}%` } }
            ];
        }
        

        console.log(whereClause)

        if (!!dateFilter) {
            // Convert the date filter to a date object
            const filterDate = new Date(dateFilter);
            const nextDay = new Date(filterDate);
            nextDay.setDate(nextDay.getDate() + 1);

            // Use the start of the day and the start of the next day to filter for a single date
            whereClause.createdAt = {
                [Sequelize.Op.gte]: filterDate,
                [Sequelize.Op.lt]: nextDay
            };
        }

        const { docs, pages, total, limit: paginationLimit } = await supportModel.paginate({ page, paginate: limit, where: whereClause });

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });

        return new ResponseClass('All support tickets fetched successfully', 200, { docs, ...paginationData }).send(res);
    });

    static particularCenterTickets = handleAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const center_id = req.user.id

        const { docs, pages, total, limit: paginationLimit } = await supportModel.paginate({ where: { center_id }, page, paginate: limit });

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });

        return new ResponseClass('Support tickets fetched successfully', 200, { docs, ...paginationData }).send(res);
    });

    static updateSupport = handleAsync(async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Updating support ticket with ID: ${id}, Status: ${status}`); // Debugging log

        const support = await supportModel.findByPk(id);
        if (!support) {
            console.error(`Support ticket not found for ID: ${id}`); // Debugging log
            return next(new ErrorClass('Support ticket not found', 404));
        }

        try {
            support.status = status || support.status;
            await support.save();

            console.log(`Support ticket updated successfully: ${JSON.stringify(support)}`); // Debugging log

            return new ResponseClass('Support ticket updated successfully', 200, support).send(res);
        } catch (error) {
            console.error(`Error updating support ticket: ${error}`); // Debugging log
            return next(new ErrorClass('Failed to update support ticket', 500));
        }
    });

};
