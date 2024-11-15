const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); // Make sure to replace with your actual Sequelize connection

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

module.exports = inquiryModal;
