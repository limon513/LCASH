const { StatusCodes } = require("http-status-codes");
const serverConfig = require("../config/server-config");
const { Utility } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

function getApiKey(data){
    try {
        const jwt = Utility.createToken(data,serverConfig.JWT_APIKEY_EXPIRY);
        return {
            apiKey: jwt,
            message: 'You must keep your api-key safe and secure. We do not store the key. If you think the key is compromised/expired (1 month) please ask for a new one.',
        };
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service Unavailable'],StatusCodes.INTERNAL_SERVER_ERROR);   
    }
}


module.exports = {
    getApiKey,
}