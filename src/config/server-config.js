const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALTROUND: process.env.SALT_ROUND,
    JWTSECRET: process.env.JWT_SECRET,
    JWTEXPIRY: process.env.JWT_EXPIRY,
    ACCEPTLOGINATTEMPT: process.env.ACCEPT_LOGIN_ATTEMPT,
    LOGINATTEMPTMESSAGE: process.env.SUSPICION_LOGIN_MESSAGE,
    SUCCESSFULLVERIFICATIONMESSAGE: process.env.SUCCESSFULL_VERIFICATION_MESSAGE,
    FAILEDVERIFICATIONMESSAGE: process.env.FAILED_VERIFICATION_MESSAGE,
    ACCEPTREQUEST: process.env.ACCEPT_ACTIVE_REQUEST,
    REJECTREQUEST: process.env.REJECT_ACTIVE_REQUEST,
}