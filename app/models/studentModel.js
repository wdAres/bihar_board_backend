const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const userModel = require('./userModel');
const paginate = require('sequelize-paginate')
const studentModel = sequelize.define('Student', {
    school_category: {
        type: DataTypes.ENUM('429', '223', '3776', '711', '69'),
        allowNull: false,
    },
    school_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    school_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    school_pincode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    center_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    center_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_father_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_mother_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob_in_figures: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dob_in_words: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    additional_subject: {
        type: DataTypes.ENUM('maths', 'home science', 'maithili', 'music', 'economics', 'porohitya', 'bhojpuri'),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'transgender'),
        allowNull: false,
    },
    caste_category: {
        type: DataTypes.ENUM('general', 'bc1', 'bc2', 'sc', 'st'),
        allowNull: false,
    },
    student_address_mohalla: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_address_po: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_address_sub_div: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_address_pin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_address_ps: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_address_dist: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
       
        unique: true,
    },
    student_mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    student_aadhar_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    nationality: {
        type: DataTypes.ENUM('indian', 'others'),
        allowNull: false,
    },
    religion: {
        type: DataTypes.ENUM('hindu', 'muslim', 'shikh', 'christian', 'others'),
        allowNull: false,
    },
    handicapped: {
        type: DataTypes.ENUM('blind', 'deaf', 'physically handicapped', 'dystixc', 'spastic','none'),
        allowNull: false,
    },
    student_category: {
        type: DataTypes.ENUM('regular', 'private', 'ex'),
        allowNull: false,
    },
    student_signature: {
        type: DataTypes.STRING, // Store file path as a string
        allowNull: true,
    },
    parent_signature: {
        type: DataTypes.STRING, // Store file path as a string
        allowNull: true,
    },
    center_signature: {
        type: DataTypes.STRING, // Store file path as a string
        allowNull: true,
    },
    school_principal_signature: {
        type: DataTypes.STRING, // Store file path as a string
        allowNull: true,
    },
    school_principal_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    school_principal_mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student_photo: {
        type: DataTypes.STRING, // Store file path as a string
        allowNull: true,
    },
    center_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel,
            key: 'id',
        }
    }
}, {
    timestamps: true,
});

userModel.hasMany(studentModel, { foreignKey: 'center_id' });
studentModel.belongsTo(userModel, { foreignKey: 'center_id' });
paginate.paginate(studentModel)
module.exports = studentModel;
