const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); // Make sure to replace with your actual Sequelize connection
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
            isEmail: true, // Ensures the email is valid
        },
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true, // This will add createdAt and updatedAt fields
});

paginate.paginate(inquiryModal)
module.exports = inquiryModal;
// koi nahi  but please notice wala and baaki apis thoda jaldi kardo time nahi hai
