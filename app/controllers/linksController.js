const importantLinksModel = require('../models/linksModel');
const ErrorClass = require('../utils/ErrorClass');
const handleAsync = require('../utils/handleAsync');
const handlePagination = require('../utils/handlePagination');
const ResponseClass = require('../utils/ResponseClass');

module.exports = class ImportantLinksController {
    static createImportantLink = handleAsync(async (req, res, next) => {
        const { label, url } = req.body;

        if (!label || !url) {
            return next(new ErrorClass('Label and URL are required!', 400));
        }

        const newImportantLink = await importantLinksModel.create({
            label,
            url,
        });

        return new ResponseClass('Important link created successfully!', 200, newImportantLink).send(res);
    });

    // Get all important links
    static getAllImportantLinks = handleAsync(async (req, res, next) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await importantLinksModel.paginate({
            page,
            paginate: limit,
            order: [['createdAt', 'DESC']],
        });

        const linksWithLatest = docs.map(link => ({
            ...link.toJSON(),
            isLatest: link.isLatest
        }));

        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });
        return new ResponseClass('All important links retrieved successfully!', 200, { docs: linksWithLatest, ...paginationData }).send(res);
    });

    // Get a single important link by ID
    static getImportantLinkById = handleAsync(async (req, res, next) => {
        const { id } = req.params;

        const link = await importantLinksModel.findByPk(id);

        if (!link) {
            return next(new ErrorClass('Important link not found!', 404));
        }

        return new ResponseClass('Important link retrieved successfully', 200, {
            ...link.toJSON(),
            isLatest: link.isLatest
        }).send(res);
    });

    // Update an important link by ID
    static updateImportantLink = handleAsync(async (req, res, next) => {
        const { id } = req.params;
        const { label, url } = req.body;

        const link = await importantLinksModel.findByPk(id);

        if (!link) {
            return next(new ErrorClass('Important link not found!', 404));
        }

        link.label = label || link.label;
        link.url = url || link.url;

        await link.save();
        return new ResponseClass('Important link updated successfully!', 200, {
            ...link.toJSON(),
            isLatest: link.isLatest
        }).send(res);
    });

}