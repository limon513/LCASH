const express = require('express');
const {info_controller} = require('../../controllers');
const accountRoute = require('./account-route');
const paymentGateWayRoute = require('./payment-gateway-route');

const router = express.Router();

router.get('/info',info_controller.info);

router.use('/account',accountRoute);

router.use('/payment-gateway',paymentGateWayRoute);


module.exports = router;