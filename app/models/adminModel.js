const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const bcrypt = require('bcryptjs');
const paginate = require('sequelize-paginate');

const adminModel = sequelize.define('Admin', {
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
            isEmail: {
                msg: 'Please provide a valid email address',
            },
            notEmpty: {
                msg: 'Email is required',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 20],
                msg: 'Password must be between 6 and 20 characters',
            },
            notEmpty: {
                msg: 'Password is required',
            },
        },
    },
    confirmPassword: { // Temporary field for validation
        type: DataTypes.VIRTUAL,
        allowNull: true,
        validate: {
            isPasswordMatch() {
                if (this.password !== this.confirmPassword) {
                    throw new Error('Password and confirm password do not match');
                }
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required',
            },
        },
    },
    mobile_no: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: {
                msg: 'Mobile number must contain only digits',
            },
            len: {
                args: [10, 10],
                msg: 'Mobile number must be exactly 10 digits',
            },
        },
    },
    role: {
        type: DataTypes.ENUM('admin'),
        allowNull: false,
        defaultValue: 'admin',
    },
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        },
    },
});
adminModel.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

paginate.paginate(adminModel);

module.exports = adminModel;
