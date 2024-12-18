const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const userModel = require('./userModel');
const paginate = require('sequelize-paginate');

const SchoolProperty = sequelize.define('SchoolProperty', {
    totalBenches: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    totalClassRooms: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    totalGuards: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    totalDesks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    totalChairs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    totalComputers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    totalProjectors: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

userModel.hasMany(SchoolProperty, { foreignKey: 'center_id' });
SchoolProperty.belongsTo(userModel, { foreignKey: 'center_id' });

paginate.paginate(SchoolProperty)
module.exports = SchoolProperty;
