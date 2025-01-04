const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const bcrypt = require('bcryptjs');
const userModel = require('./userModel');
const paginate = require('sequelize-paginate');
const employeeModel = sequelize.define('Employee', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Must be a valid email address.' }
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: { msg: 'Phone number should only contain numeric characters.' },
            len: { args: [10, 15], msg: 'Phone number should be between 10 to 15 digits.' }
        }
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    center_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel,
            key: 'id',
        }
    }
});

userModel.hasMany(employeeModel, { foreignKey: 'center_id' });
employeeModel.belongsTo(userModel, { foreignKey: 'center_id' });
paginate.paginate(employeeModel);
module.exports = employeeModel;
