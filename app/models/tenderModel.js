const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../connection/db'); // Replace with your actual Sequelize connection
const paginate = require('sequelize-paginate')
const tenderModel = sequelize.define('Tender', {
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isLatest: {
        type: DataTypes.VIRTUAL,
        get() {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return this.createdAt > oneMonthAgo;
        }
    }
}, {
    timestamps: true,
});

paginate.paginate(tenderModel)
module.exports = tenderModel;

