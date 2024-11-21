const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); 
const paginate = require('sequelize-paginate');

const inquiryModal = sequelize.define('Inquiry', {
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
            isEmail: true, 
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: { msg: 'Phone number must be digits only'},
            len: {
                args: [10, 10],
                msg: 'Mobile number must be exactly 10 digits long',
            },
        },
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true, 
});

paginate.paginate(inquiryModal);
module.exports = inquiryModal;