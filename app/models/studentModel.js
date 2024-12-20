
const { DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const userModel = require('./userModel');
const paginate = require('sequelize-paginate');
const moment = require('moment');
const { toWords } = require('number-to-words');

const studentModel = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Student name is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Student name cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_father_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Father\'s name is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Father\'s name cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_mother_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Mother\'s name is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Mother\'s name cannot have leading or trailing spaces.');
                }
            }
        }
    },
    dob_in_figures: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    dob_in_words: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //     notEmpty: { msg: 'Date of birth in words is required.' },
        //     trim(value) {
        //         if (value.trim() !== value) {
        //             throw new Error('Date of birth in words cannot have leading or trailing spaces.');
        //         }
        //     }
        // }
    },
    additional_subject: {
        type: DataTypes.ENUM('maths', 'home science', 'maithili', 'music', 'economics', 'porohitya', 'bhojpuri'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Additional subject is required.' },
        }
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'transgender'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Gender is required.' },
        }
    },
    caste_category: {
        type: DataTypes.ENUM('general', 'bc1', 'bc2', 'sc', 'st'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Caste category is required.' },
        }
    },
    student_address_mohalla: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Mohalla address is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Mohalla address cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_address_po: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Post office address is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Post office address cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_address_sub_div: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Sub-division address is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Sub-division address cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_address_pin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: { msg: 'Pincode must be numeric.' },
            len: { args: [6, 6], msg: 'Pincode must be 6 digits long.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Pincode cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_address_ps: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Police station address is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Police station address cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_address_dist: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'District address is required.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('District address cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Email must be unique.' },
        validate: {
            isEmail: { msg: 'Invalid email format.' },
        }
    },
    student_mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Mobile number must be unique.' },
        validate: {
            isNumeric: { msg: 'Mobile number must be numeric.' },
            len: { args: [10, 10], msg: 'Mobile number must be 10 digits long.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Mobile number cannot have leading or trailing spaces.');
                }
            }
        }
    },
    student_aadhar_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Aadhar number must be unique.' },
        validate: {
            isNumeric: { msg: 'Aadhar number must be numeric.' },
            len: { args: [12, 12], msg: 'Aadhar number must be 12 digits long.' },
            trim(value) {
                if (value.trim() !== value) {
                    throw new Error('Aadhar number cannot have leading or trailing spaces.');
                }
            }
        }
    },
    nationality: {
        type: DataTypes.ENUM('indian', 'others'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Nationality is required.' },
        }
    },
    religion: {
        type: DataTypes.ENUM('hindu', 'muslim', 'shikh', 'christian', 'others'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Religion is required.' },
        }
    },
    handicapped: {
        type: DataTypes.ENUM('blind', 'deaf', 'physically handicapped', 'dystixc', 'spastic', 'none'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Handicapped status is required.' },
        }
    },
    student_category: {
        type: DataTypes.ENUM('regular', 'private', 'ex'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Student category is required.' },
        }
    },
    student_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    parent_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    student_photo: {
        type: DataTypes.STRING,
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
    hooks: {
        beforeSave: (student, options) => {

            if (student.dob_in_figures) {
                const dobInFigures = moment(student.dob_in_figures);
                const day = dobInFigures.date();
                const month = dobInFigures.format('MMMM');
                const year = dobInFigures.year();
                const dayInWords = toWords(day);

                const yearInWords = toWords(year).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                student.dob_in_words = `${dayInWords.charAt(0).toUpperCase() + dayInWords.slice(1)} ${month} ${yearInWords}`;
            }

            const fieldsToUppercase = [
                'student_name',
                'student_father_name',
                'student_mother_name',
                'dob_in_words',
                'student_address_mohalla',
                'student_address_po',
                'student_address_sub_div',
                'student_address_pin',
                'student_address_ps',
                'student_address_dist',
                'student_email',
                'student_mobile_number',
                'student_aadhar_number',

            ];
            fieldsToUppercase.forEach(field => {
                if (student[field]) {
                    student[field] = student[field].toUpperCase();
                }
            });
        }
    }
});

userModel.hasMany(studentModel, { foreignKey: 'center_id', as: 'students' });
studentModel.belongsTo(userModel, { foreignKey: 'center_id', as: 'center' });
paginate.paginate(studentModel);

module.exports = studentModel;

