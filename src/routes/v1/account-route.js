const express = require('express');
const router = express.Router();
const {AccountMiddleware} = require('../../middlewares');
const {AccountController} = require('../../controllers')

router.post('/',AccountMiddleware.userValidate,AccountController.create);

module.exports = router;