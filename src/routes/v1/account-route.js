const express = require('express');
const router = express.Router();
const {AccountMiddleware,AuthenticationMiddleware,RequestMiddleware,TransferMiddleware} = require('../../middlewares');
const {AccountController,SuspicionController, RequestController, TransferController, PaymentGateWayController} = require('../../controllers')

router.post('/signup',
    AccountMiddleware.userValidate,
    AccountController.create);

router.post('/signin',
    AccountMiddleware.signInValidate,
    AccountController.singIn);

router.post('/update',
    AccountMiddleware.userUpdateValidate,
    AuthenticationMiddleware.verifyToken,
    AccountMiddleware.userSuspicionValidate,
    AccountController.updateUser);

router.post('/verify',
    SuspicionController.clearSuspicion);

router.post('/request',
    AuthenticationMiddleware.verifyToken,
    RequestMiddleware.validateRequest,
    RequestController.create);

router.post('/request/resolve/:id',
    AuthenticationMiddleware.verifyToken,
    AuthenticationMiddleware.authSuperAdmin,
    RequestMiddleware.validateResolveRequest,
    RequestController.resolveRequest);

router.post('/transfer/cashout',
    TransferMiddleware.transferValidate,
    AuthenticationMiddleware.verifyToken,
    AccountMiddleware.userSuspicionValidate,
    AuthenticationMiddleware.isActive,
    TransferController.TransferMoney);

router.post('/transfer/cashin',
    TransferMiddleware.transferValidate,
    AuthenticationMiddleware.verifyToken,
    AccountMiddleware.userSuspicionValidate,
    AuthenticationMiddleware.isActive,
    TransferController.TransferMoney);

router.post('/transfer/sendmoney',
    TransferMiddleware.transferValidate,
    AuthenticationMiddleware.verifyToken,
    AccountMiddleware.userSuspicionValidate,
    AuthenticationMiddleware.isActive,
    TransferController.TransferMoney);

router.post('/transfer/payment',
    TransferMiddleware.transferValidate,
    AuthenticationMiddleware.verifyToken,
    AccountMiddleware.userSuspicionValidate,
    AuthenticationMiddleware.isActive,
    TransferController.TransferMoney);


router.post('/getApiKey',
    AuthenticationMiddleware.verifyToken,
    AuthenticationMiddleware.authMarchent,
    PaymentGateWayController.getApiKey);

router.put('/unblock',
    AuthenticationMiddleware.verifyToken,
    AuthenticationMiddleware.authSuperAdmin,
    AccountController.unblockAccount);

router.get('/transactions',
    AuthenticationMiddleware.verifyToken,
    TransferController.getTransactions);

module.exports = router;