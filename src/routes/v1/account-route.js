const express = require('express');
const router = express.Router();
const {AccountMiddleware,AuthenticationMiddleware} = require('../../middlewares');
const {AccountController,SuspicionController, RequestController} = require('../../controllers')

router.post('/signup',AccountMiddleware.userValidate,AccountController.create);

router.post('/signin',AccountMiddleware.signInValidate,AccountController.singIn);

router.post('/verify',SuspicionController.clearSuspicion);

router.post('/active_request',AuthenticationMiddleware.verifyToken,RequestController.create);

module.exports = router;