const amqplib = require('amqplib');
const Logger  = require('./logger-config');

async function connectQueue(){
    try {
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue('Lcash-Noti');
        return channel;
    } catch (error) {
        Logger.log({
            level:'info',
            message:error.message,
            label:__filename,
            errors:error,
        });
    }
}

module.exports = {
    connectQueue,
}