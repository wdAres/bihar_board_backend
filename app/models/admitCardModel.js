const { DataTypes , UUIDV4 } = require('sequelize');
const studentModel = require('./studentModel');
const sequelize = require('../connection/db');

const admitCardModel = sequelize.define('AdmitCard', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true , 
        primaryKey: true,
    },
    admit_card: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: studentModel,
            key: 'id',
        }
    }
}, {
    timestamps: true
});

module.exports = admitCardModel;