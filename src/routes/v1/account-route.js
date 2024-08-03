const express = require('express');
const router = express.Router();
const {AccountMiddleware} = require('../../middlewares');
const {AccountController} = require('../../controllers')

router.post('/signup',AccountMiddleware.userValidate,AccountController.create);

router.post('/signin',AccountMiddleware.signInValidate,AccountController.singIn);

module.exports = router;