const Logger = require('../../config/logger-config');
const cron = require('node-cron');
const { RequestService, TransferService, EmailService } = require('../../services');
const { Enums, Utility } = require('../common');
const serverConfig = require('../../config/server-config');
const { QUEUE } = require('../../config');

function scheduleCrons() {
    cron.schedule('00 00 * * *', async () => {
        const response = await RequestService.resetTransferLimit();
        if (response) {
            Logger.log({
                level: 'info',
                message: 'Limit Reset Successfull',
                label: __filename,
                errors: {}
            });
        }
        else {
            Logger.log({
                level: 'info',
                message: 'Limit Reset Failed',
                label: __filename,
                errors: {}
            });
        }
    });

    cron.schedule('*/1 * * * *', async () => {
        try {
            const transfers = await TransferService.getPendingNotifiedTransactions(Enums.NOTIFIED_STATUS.PENDING);
            transfers.forEach(async (transfer) => {
                const message = Utility.createResponseForTransfer(transfer.status,
                    transfer.transactionId,
                    transfer.transactionType,
                    transfer.amount,
                    transfer.charges,
                    transfer.reciverAccount);
                if (transfer.senderEmail) {
                    const data = {
                        message:message,
                        senderEmail:transfer.senderEmail,
                    };
                    await QUEUE.connectQueue();
                    await QUEUE.sendData(data);
                }

                if (transfer.status === Enums.TRANSACTION_STATUS.SUCCESSFUL && transfer.reciverEmail) {
                    const data = {
                        message: Utility.createResponseForDeposite(transfer.transactionId,transfer.amount,transfer.senderAccount),
                        reciverEmail:transfer.reciverEmail,
                    }
                    await QUEUE.connectQueue();
                    await QUEUE.sendData(data);
                }

                await TransferService.resolveTransferOnNotification(transfer.transactionId);
            });
        } catch (error) {
            console.log(error);
        }
    });

    // cron.schedule('*/3 * * * *', async () => {
    //     try {
    //         const transfers = await TransferService.getPendingNotifiedTransactions(Enums.NOTIFIED_STATUS.PENDING);
    //         console.log(transfers);
    //         transfers.forEach(async (transfer)=>{
    //             const message = Utility.createResponseForTransfer(transfer.status,
    //                 transfer.transactionId,
    //                 transfer.transactionType,
    //                 transfer.amount,
    //                 transfer.charges,
    //                 transfer.reciverAccount);
    //             if(transfer.senderEmail){
    //                 await EmailService.sendEmail(serverConfig.GMAILMAIL,
    //                     transfer.senderEmail,
    //                     'Transaction Info',
    //                     message);
    //             }

    //             if(transfer.status === Enums.TRANSACTION_STATUS.SUCCESSFUL && transfer.reciverEmail){
    //                 await EmailService.sendEmail(serverConfig.GMAILMAIL,
    //                     transfer.reciverEmail,
    //                     'Transaction Info',
    //                     Utility.createResponseForDeposite(transfer.transactionId,transfer.amount,transfer.senderAccount));
    //             }

    //             await TransferService.resolveTransferOnNotification(transfer.transactionId);
    //         });
    //     } catch (error) {   
    //         console.log(error);
    //     }
    // });



}

module.exports = {
    scheduleCrons,
}