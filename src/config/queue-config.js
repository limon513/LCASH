const amqplib = require('amqplib');
const Logger  = require('./logger-config');

let channel,connection;

async function connectQueue(){
    try {
        connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('Lcash-Noti');
    } catch (error) {
        Logger.log({
            level:'info',
            message:error.message,
            label:__filename,
            errors:error,
        });
    }
}

async function sendData(data){
    try {
        await channel.sendToQueue('Lcash-Noti',Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectQueue,
    sendData,
}