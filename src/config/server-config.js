const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALTROUND: process.env.SALT_ROUND,
    JWTSECRET: process.env.JWT_SECRET,
    JWTEXPIRY: process.env.JWT_EXPIRY,
}