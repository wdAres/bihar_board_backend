const userModel = require("../models/userModel")
const ErrorClass = require("../utils/ErrorClass")
const handleAsync = require("../utils/handleAsync")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createSendToken } = require("../utils/handleToken")
const ResponseClass = require("../utils/ResponseClass")


module.exports = class AuthController {


    // static createUser = handleAsync(async (req, res, next) => {

    //     console.log(req.body)


    //     const newUser = await userModel.create(req.body)

    //     if (!newUser) {
    //         throw new Error("something went wrong!")
    //     }

    //     return new ResponseClass('User created succcessfully', 200, { user: newUser }).send(res)

    // })

    static createUser = handleAsync(async (req, res, next) => {
        try {
            const requiredFields = [
                'email', 'password', 'confirmPassword', 'school_name',
                'school_level', 'school_district', 'school_mobile_no', 'school_pincode',
            ];
    
            const { body } = req;
    
            const missingFields = [];
            const spaceInvalidFields = [];
    
            // Check for missing fields and spaces
            requiredFields.forEach((field) => {
                if (!body[field]) {
                    missingFields.push(field);
                } else if (body[field].trim() !== body[field]) {
                    spaceInvalidFields.push(field);
                }
            });
    
            if (missingFields.length > 0) {
                return next(
                    new ErrorClass(`Missing required fields: ${missingFields.join(', ')}`, 400)
                );
            }
    
            if (spaceInvalidFields.length > 0) {
                return next(
                    new ErrorClass(
                        `Spaces not allowed at the beginning or end of the following fields: ${spaceInvalidFields.join(', ')}`,
                        400
                    )
                );
            }
    
            const existingEmail = await userModel.findOne({ where: { email: body.email.trim() } });
            if (existingEmail) {
                return next(new ErrorClass('A user with this email already exists!', 400));
            }
    
            const existingMobile = await userModel.findOne({ where: { school_mobile_no: body.school_mobile_no.trim() } });
            if (existingMobile) {
                return next(new ErrorClass('A user with this mobile number already exists!', 400));
            }
    
            const existingPincode = await userModel.findOne({ where: { school_pincode: body.school_pincode.trim() } });
            if (existingPincode) {
                return next(new ErrorClass('A user with this pincode already exists!', 400));
            }
    
            const newUser = await userModel.create({
                ...Object.fromEntries(
                    Object.entries(body).map(([key, value]) => [key, value.trim()])
                ), 
            });
    
            if (!newUser) {
                throw new Error('Something went wrong!');
            }
    
            return new ResponseClass('User created successfully', 200, { user: newUser }).send(res);
        } catch (error) {
            next(new ErrorClass(error.message || 'Something went wrong!', 500));
        }
    });
    

    static loginUser = handleAsync(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorClass('required information in missing!', 400))
        }

        const user = await userModel.findOne({ where: { email: email } })

        const passwordMatch = await user.comparePassword(password)

        if (!user || !passwordMatch) {
            return next(new ErrorClass('invalid password or email', 401))
        }

        createSendToken(user, 200, res);

    })

}
