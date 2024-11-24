const adminModel = require('../models/adminModel');
const handleAsync = require('../utils/handleAsync');
const ResponseClass = require('../utils/ResponseClass');
const ErrorClass = require('../utils/errorClass');
const { createSendToken } = require('../utils/handleToken');


exports.createAdmin = handleAsync(async (req, res, next) => {
    const admin = await adminModel.create(req.body);

    if (!admin) {
        return next(new ErrorClass('Failed to create admin!', 400));
    }

    return new ResponseClass('Admin created successfully', 201, { admin }).send(res);
});

exports.loginAdmin = handleAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const admin = await adminModel.findOne({ where: { email } });

    const passwordMatch = await admin.comparePassword(password)

    if (!admin || !passwordMatch) {
        return next(new ErrorClass('Invalid password or email', 401))
    }

    createSendToken(admin, 200, res);
});
