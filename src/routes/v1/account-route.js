const express = require('express');
const router = express.Router();
const {AccountMiddleware,AuthenticationMiddleware,RequestMiddleware} = require('../../middlewares');
const {AccountController,SuspicionController, RequestController, TransferController} = require('../../controllers')

router.post('/signup',AccountMiddleware.userValidate,AccountController.create);

router.post('/signin',AccountMiddleware.signInValidate,AccountController.singIn);

router.post('/verify',SuspicionController.clearSuspicion);

router.post('/request',AuthenticationMiddleware.verifyToken,RequestMiddleware.validateRequest,RequestController.create);

router.post('/request/resolve/:id',AuthenticationMiddleware.verifyToken,AuthenticationMiddleware.authSuperAdmin,RequestMiddleware.validateResolveRequest,RequestController.resolveRequest);

router.post('/transfer',TransferController.CashOut);

module.exports = router;