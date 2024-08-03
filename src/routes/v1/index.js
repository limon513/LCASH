const express = require('express');
const {info_controller} = require('../../controllers');
const accountRoute = require('./account-route');

const router = express.Router();

router.get('/info',info_controller.info);

router.use('/account',accountRoute);

module.exports = router;