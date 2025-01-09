const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const paginate = require('sequelize-paginate');
const previousDataModel = sequelize.define('PreviousData', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_father_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_mother_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob_in_figures: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_sex: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_aadhar_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pin_code_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    school_name_2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_required_subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    additional_subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    student_photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    centre_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    school_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    centre_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registration_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_parents_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    assistant_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    secretary_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exam_controller_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    permission_no: { 
        type: DataTypes.STRING,
        allowNull: true,
    },
    roll_no: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});
paginate.paginate(previousDataModel);
module.exports = previousDataModel;
