const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db'); // Make sure to replace with your actual Sequelize connection
const paginate = require('sequelize-paginate')

const ContactModal = sequelize.define('Contact', {
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
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true, // This will add createdAt and updatedAt fields
});


paginate.paginate(ContactModal)
module.exports = ContactModal;
