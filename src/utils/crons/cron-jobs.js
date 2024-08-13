const Logger = require('../../config/logger-config');
const cron = require('node-cron');
const { RequestService } = require('../../services');

function scheduleCrons(){
    cron.schedule('00 00 * * *', async () => {
        const response = await RequestService.resetTransferLimit();
        if(response){
            Logger.log({
                level:'info',
                message:'Limit Reset Successfull',
                label:__filename,
                errors:{}
            });
        }
        else {
            Logger.log({
                level:'info',
                message:'Limit Reset Failed',
                label:__filename,
                errors:{}
            });
        }
    });
}

module.exports = {
    scheduleCrons,
}