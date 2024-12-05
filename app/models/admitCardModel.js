const { DataTypes } = require('sequelize');
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

studentModel.belongsTo(admitCardModel, { foreignKey: 'student_id' });
admitCardModel.belongsTo(studentModel, { foreignKey: 'admit_card_id' });

module.exports = admitCardModel;