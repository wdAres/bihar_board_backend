const jwt = require('jsonwebtoken');
const ErrorClass = require('./errorClass');
const userModel = require('../models/userModel');
const handleAsync = require('./handleAsync');
const { promisify } = require("util");

exports.createSendToken = (user, statusCode, res) => {
    const token = jwt.sign({ email: user.email , role:user.role , id : user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });;

    // CREATING AND SENDING COOKIE TO THE CLIENT
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env_NODE_ENV === 'production') cookieOptions.secure = true
    res.cookie("jwt", token, cookieOptions);

    // UNSEND PASSWORD IN THE USER OBJECT
    user.password = undefined

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

//  Protected Route ( Middleware which requires token )
exports.protectedRoute = handleAsync(async (req, res, next) => {
    // 1)  CHECK TOKEN IS PRESENT OR NOT IN THE HEADERS
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new ErrorClass("You are not logged in! Please login for the access", 401)
        );
    }

    // 2) VERIFY THE TOKEN
    let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) CHECK IF THE USER EXIST OR NOT
    const currentUser = await userModel.findOne({ where: { email: decode.email } });
    if (!currentUser) {
        return next(new AppError("User is no longer available", 401));
    }

    req.user = currentUser;
    next();
});

// MIDDLEWARE FOR UNAUTHORIZED ACCESS (ROUTES ONLY FOR ADMIN)
exports.authorizedRoute = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorClass("user is not authroized for this route", 401));
        }
        next();
    };
};
