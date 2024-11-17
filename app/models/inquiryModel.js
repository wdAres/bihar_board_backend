const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); 
const paginate = require('sequelize-paginate')

const inquiryModal = sequelize.define('Inquiry', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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

paginate.paginate(inquiryModal)
module.exports = inquiryModal;

