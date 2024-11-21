const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const paginate = require('sequelize-paginate');

const inquiryModel = sequelize.define('Inquiry', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            trim(value) {
                if (typeof value === 'string') {
                    this.setDataValue('name', value.trim().replace(/\s\s+/g, ' '));
                }
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Email is required',
            },
            isEmail: {
                msg: 'Invalid email format',
            },
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Phone number is required',
            },
            isNumeric: {
                msg: 'Phone number must contain only numbers',
            },
            len: {
                args: [10, 10],
                msg: 'Phone number must be exactly 10 digits',
            },
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
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Message is required',
            },
        },
    },
}, {
    timestamps: true,
});

paginate.paginate(inquiryModel);

module.exports = inquiryModel;
