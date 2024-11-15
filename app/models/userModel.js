const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const bcrypt = require('bcryptjs');

const userModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirmPassword: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isSame(value) {
                if (value !== this.password) {
                    throw new Error('Password and confirm password did not match');
                }
            }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'center'),
        allowNull: false,
        defaultValue: 'center',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull: false,
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {

            // Hash the password
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }

            // Remove confirmPassword field after checking
            user.confirmPassword = undefined;
        }
    },
    
});


// Static Functions
userModel.prototype.comparePassword = async function (candidatePassword) {
   return  await bcrypt.compare(candidatePassword, this.password);
}

module.exports = userModel;
