const { StatusCodes } = require("http-status-codes");
const { MAILER } = require("../config");
const AppError = require("../utils/errors/app-error");

async function sendEmail(from, to, subject, text){
    try {
        const response = await MAILER.sendMail({
            from:from,
            to:to,
            subject:subject,
            text:text,
        });
        return response;
    } catch (error) {
        throw new AppError(['Service Unavailable'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    sendEmail,
}