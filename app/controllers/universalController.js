const { where } = require("sequelize");
const ErrorClass = require("../utils/errorClass");
const handleAsync = require("../utils/handleAsync");
const handlePagination = require("../utils/handlePagination");
const ResponseClass = require("../utils/ResponseClass");

module.exports = class UniversalController {
    static addDocument = function (Model) {
        return handleAsync(async (req, res, next) => {

            const doc = await Model.create(req.body);

            if (!doc) {
                return next(new ErrorClass('Found issue while creating document', 404));
            }

            return new ResponseClass(`Document is successfully created.`, 200, doc).send(res)

        })
    }
    static getDocuments = function (Model, whereClause = false, includeArr = []) {
        return handleAsync(async (req, res, next) => {

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const whereObj = whereClause ? whereClause : {}

            const { docs, pages, total, limit: paginationLimit } = await Model.paginate({
                page,
                paginate: limit,
                order: [['createdAt', 'DESC']],
                where: whereObj,
                include: includeArr
            });


            const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


            return new ResponseClass('Your documents is successfully loaded.', 200, { docs, ...paginationData }).send(res)

        })
    }
    static getDocument = function (Model, whereClause = false, includeArr = []) {
        return handleAsync(async (req, res, next) => {

            const { id } = req.params;

            console.log(req.params)

            const whereObj = whereClause ? whereClause : {};
            const doc = await Model.findOne({ where: { ...whereObj, id : parseInt(id,10) }, include: includeArr });


            if (!doc) {
                return next(new ErrorClass('No document found!', 404));
            }

            return new ResponseClass(`Document Information.`, 200, doc).send(res)


        })
    }
    static deleteDocument = function (Model) {
        return handleAsync(async (req, res, next) => {

            const { id } = req.params;
            const doc = await Model.findByPk(id);

            if (!doc) {
                return next(new ErrorClass('No document found!', 404));
            }

            await doc.destroy()

            return new ResponseClass(`Document is successfully deleted.`, 200, null).send(res)


        })
    }
    static updateDocument = function (Model) {
        return handleAsync(async (req, res, next) => {

            const { id } = req.params;
            const doc = await Model.findByPk(id);

            if (!doc) {
                return next(new ErrorClass('No document found!', 404));
            }

            await doc.update(req.body, { fields: Object.keys(req.body) })

            return new ResponseClass(`Document is successfully updated.`, 200, doc).send(res)


        })
    }
}