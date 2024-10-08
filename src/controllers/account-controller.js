const {AccountService} = require('../services');
const {ErrorResponse,SuccessResponse} = require('../utils/common');
const {StatusCodes} = require('http-status-codes')

async function create(req,res){
    try {
        // console.log('inside controller');
        const response = await AccountService.create(req.body);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function singIn(req,res){
    try {
        const response = await AccountService.signIn(req.body);
        SuccessResponse.data = response;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function updateUser(req,res){
    const data = {};
    if(req.body.userName) data.userName = req.body.userName;
    if(req.body.useEmail) data.useEmail = req.body.useEmail;
    try {
        const response = await AccountService.updateUser(req.body.accNumber,data);
        SuccessResponse.data = response;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function unblockAccount(req,res){
    try {
        const response = await AccountService.unblockAccount(req.body.number);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    create,
    singIn,
    unblockAccount,
    updateUser,
}