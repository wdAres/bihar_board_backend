const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../connection/db'); // Replace with your actual Sequelize connection
const paginate = require('sequelize-paginate')
const noticeModel = sequelize.define('Notice', {
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    // Virtual Fields
    getterMethods: {
        latest() {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return this.createdAt > oneMonthAgo;
        }
    }
});
paginate.paginate(noticeModel)
module.exports = noticeModel;
