const { Op } = require('sequelize');
const studentModel = require('../models/studentModel');
const userModel = require('../models/userModel');
const ResponseClass = require('../utils/ResponseClass');
const ErrorClass = require('../utils/errorClass');
const handleAsync = require('../utils/handleAsync');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const exceljs = require('exceljs');
module.exports = class filterData {


    static filterStudentsByDate = handleAsync(async (req, res, next) => {
        const { date } = req.body;

        if (!date) {
            return next(new ErrorClass('Date parameter is required', 400));
        }

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        try {
            const students = await studentModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                },
                include: [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]
            });

            return new ResponseClass('Records retrieved successfully!', 200, { students }).send(res);
        } catch (error) {
            return next(new ErrorClass(error.message || 'Something went wrong!', 500));
        }
    });

    static filterCentersByDate = handleAsync(async (req, res, next) => {
        const { date } = req.body;

        if (!date) {
            return next(new ErrorClass('Date parameter is required', 400));
        }

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        try {
            const centers = await userModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                }
            });

            return new ResponseClass('Records retrieved successfully!', 200, { centers }).send(res);
        } catch (error) {
            return next(new ErrorClass(error.message || 'Something went wrong!', 500));
        }
    });

    static searchByStudetName = handleAsync(async (req, res, next) => {
        const { name } = req.body; if (!name) { return next(new ErrorClass('Name parameter is required', 400)); } try {
            const students = await studentModel.findAll({
                where: {
                    student_name: {
                        [Op.iLike]: `%${name}%`
                    }
                }, include: [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]
            });
            return new ResponseClass('Records retrieved successfully!', 200, { students }).send(res);
        }
        catch (error) {
            return next(new ErrorClass(error.message || 'Something went wrong!', 500));

        }
    });

    static searchByCenterName = handleAsync(async (req, res, next) => {
        const { name } = req.body; if (!name) { return next(new ErrorClass('Name parameter is required', 400)); }
        try {
            const centers = await userModel.findAll({ where: { school_name: { [Op.iLike]: `%${name}%` } } });
            return new ResponseClass('Records retrieved successfully!', 200, { centers }).send(res);
        }
        catch (error) {
            return next(new ErrorClass(error.message || 'Something went wrong!', 500));

        }
    });

    static downloadStudentsXLS = handleAsync(async (req, res, next) => {
        try {
            const students = await studentModel.findAll({
                // include: [{ model: userModel, as: 'center', attributes: { exclude: ['password'] } }]
            });

            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Students');

            worksheet.columns = Object.keys(studentModel.rawAttributes).map(key => ({ header: key, key }));

            students.forEach(student => {
                worksheet.addRow(student.toJSON());
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            return next(new ErrorClass(error.message || 'Something went wrong!', 500));
        }
    });

    static downloadCentersXLS = handleAsync(async (req, res, next) => {
        try {
            const centers = await userModel.findAll();

            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Centers');

            worksheet.columns = Object.keys(userModel.rawAttributes).map(key => ({ header: key, key }));

            centers.forEach(center => {
                worksheet.addRow(center.toJSON());
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=centers.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            return next(new ErrorClass(error.message || 'Something went wrong!', 500));
        }
    });
};


