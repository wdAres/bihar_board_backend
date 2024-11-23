const userModel = require("../models/userModel")
const handleAsync = require("../utils/handleAsync")
const ResponseClass = require('../utils/ResponseClass')
const handlePagination = require('../utils/handlePagination');

module.exports = class CenterController {
    static getAllCenters = handleAsync(async (req, res, next) => {
        const centers = await userModel.findAll({ where: { role: 'center' } })
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await userModel.paginate({ page, paginate: limit, where: { role: 'center' }, order: [['createdAt', 'DESC']], });


        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


        return new ResponseClass('All inquiry data', 200, { docs, ...paginationData }).send(res)

    })

    static getCenterById = handleAsync(async (req, res, next) => {
        const { id } = req.params;
        const center = await userModel.findOne({
            where: {
                role: 'center',
                id: id
            }
        });

        if (!center) {
            return next(new ErrorClass('Center not found!', 404));
        }
        return new ResponseClass(`Details of center with ID ${id}`, 200, center).send(res)

    });

    static deleteCenterById = handleAsync(async (req, res, next) => {
        
        const { id } = req.params;
        const center = await userModel.findByPk(id);

        if (!center) {
            return next(new ErrorClass('Center not found!', 404));
        }

        await center.destroy()

        return new ResponseClass(`center Removed`, 200, null).send(res)

    });

    static getDetails = handleAsync(async (req, res, next) => {
        const id = req.user.id;
        const center = await userModel.findByPk(id);

        if (!center) {
            return next(new ErrorClass('Center not found!', 404));
        }

        return new ResponseClass(`Here is your center details`, 200, center).send(res)

    });

    static updateDetails = handleAsync(async (req, res, next) => {

        const { id } = req.user;

        const center = await userModel.findByPk(id);

        if (!center) {
            return next(new ErrorClass('Center not found!', 404));
        }

        if (req.file) { req.body.school_principal_signature = req.file.path; }

        await center.update(req.body, { fields: Object.keys(req.body) })

        return new ResponseClass(`Details Updated`, 200, center).send(res)
    });

}