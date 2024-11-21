const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const bcrypt = require('bcryptjs');
const paginate = require('sequelize-paginate');

const userModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
     school_category: {
        type: DataTypes.ENUM('429', '223', '3776', '711', '69'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'School category cannot be empty.' },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Email already exists.', 
        },
        validate: {
            isEmail: {
                msg: 'Invalid email format.',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 50],
                msg: 'Password must be between 8 and 50 characters.',
            },
        },
    },
    confirmPassword: {
        type: DataTypes.VIRTUAL, 
        validate: {
            isSame(value) {
                if (value !== this.password) {
                    throw new Error('Password and confirm password did not match.');
                }
            },
        },
    },
    role: {
        type: DataTypes.ENUM('center'),
        allowNull: false,
        defaultValue: 'center',
    },
    school_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'School name already exists.',
        },
        validate: {
            notEmpty: {
                msg: 'School name is required.',
            },
            noLeadingOrTrailingSpaces(value) {
                if (/^\s|\s$/.test(value)) {
                    throw new Error('School name cannot have leading or trailing spaces.');
                }
            },
            noMultipleSpaces(value) {
                if (/\s{2,}/.test(value)) {
                    throw new Error('School name cannot have multiple consecutive spaces.');
                }
            }
        },
    },
    
    school_level: {
        type: DataTypes.ENUM('primary', 'secondary', 'senior secondary', 'middle'),
        allowNull: false,
    },
    school_district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'School district is required.',
            },
        },
    },
    school_mobile_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Mobile number already exists.', 
        },
        validate: {
            isNumeric: {
                msg: 'Mobile number must contain only digits.',
            },
            len: {
                args: [10, 10],
                msg: 'Mobile number must be exactly 10 digits.',
            },
        },
    },
    school_pincode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Pincode already exists.', 
        },
        validate: {
            isNumeric: {
                msg: 'Pincode must contain only digits.',
            },
            len: {
                args: [6, 6],
                msg: 'Pincode must be exactly 6 digits.',
            },
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    profile_review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    center_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // center_signature: { //
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    school_principal_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
   
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
    },
});

userModel.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

paginate.paginate(userModel);

module.exports = userModel;
// sequelize.sync().then(async () => { await sequelize.query(`ALTER SEQUENCE "Users_id_seq" RESTART WITH 10000`); });