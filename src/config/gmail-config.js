const nodemailer = require('nodemailer');
const serverConfig = require('./server-config');

const mailsender = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: serverConfig.GMAILMAIL,
        pass: serverConfig.GMAILPASS,
    }
});

module.exports = mailsender;