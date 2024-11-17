const userModel = require("../models/userModel")
const ErrorClass = require("../utils/errorClass")
const handleAsync = require("../utils/handleAsync")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createSendToken } = require("../utils/handleToken")
const ResponseClass = require("../utils/ResponseClass")


module.exports = class AuthController {


    static createUser = handleAsync(async (req, res, next) => {

        console.log(req.body)


        const newUser = await userModel.create(req.body)

        if (!newUser) {
            throw new Error("something went wrong!")
        }

        return new ResponseClass('User created succcessfully', 200, { user: newUser }).send(res)

    })

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
