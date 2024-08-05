const express = require('express');
const router = express.Router();
const {AccountMiddleware} = require('../../middlewares');
const {AccountController,SuspicionController} = require('../../controllers')

router.post('/signup',AccountMiddleware.userValidate,AccountController.create);

router.post('/signin',AccountMiddleware.signInValidate,AccountController.singIn);

router.post('/verify',SuspicionController.clearSuspicion);

module.exports = router;