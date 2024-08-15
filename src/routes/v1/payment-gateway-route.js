const express = require('express');
const router = express.Router();
const {AccountMiddleware,AuthenticationMiddleware,RequestMiddleware,TransferMiddleware, PaymentGateWayMiddleware} = require('../../middlewares');
const {AccountController,SuspicionController, RequestController, TransferController, PaymentGateWayController} = require('../../controllers')


router.post('/verification',
    PaymentGateWayMiddleware.validateVerification,
    PaymentGateWayController.requrestVerificationCode);

router.post('/verify',
    PaymentGateWayMiddleware.validateVerify,
    PaymentGateWayController.matchCode);

router.post('/payment',
    PaymentGateWayMiddleware.verifyApiKey,
    PaymentGateWayMiddleware.verifyTepmToken,
    PaymentGateWayMiddleware.authMarchent,
    TransferMiddleware.transferValidate,
    TransferController.TransferMoney);


module.exports = router;