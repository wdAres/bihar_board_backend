const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const userModel = require('./userModel');
const paginate = require('sequelize-paginate');

const supportModel = sequelize.define('Support', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    center_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel,
            key: 'id',
        },
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Subject is required',
            },
        },
    },
    issue_or_message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Issue or message is required',
            },
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    timestamps: true,
});

userModel.hasMany(supportModel, { foreignKey: 'center_id' });
supportModel.belongsTo(userModel, { foreignKey: 'center_id' });

paginate.paginate(supportModel)
module.exports = supportModel;
