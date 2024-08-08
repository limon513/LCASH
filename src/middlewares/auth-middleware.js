const jwt = require('jsonwebtoken');
const {SuccessResponse,ErrorResponse} = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');
const { AccountRepository } = require('../repositories');

function verifyToken(req,res,next){
    const token = req.headers['x-access-token'];
    if(!token){
        ErrorResponse.error = new AppError(['JWT not found!'],StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    try {
        const user = jwt.verify(token,serverConfig.JWTSECRET);
        next();
    } catch (error) {
        ErrorResponse.error = new AppError(error.message,StatusCodes.UNAUTHORIZED);
        res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

//TODO: authorize superadmins
function authSuperAdmin(req,res,next){
    
}


module.exports = {
    verifyToken,
}