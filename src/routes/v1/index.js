const express = require('express');
const {info_controller} = require('../../controllers');

const router = express.Router();

router.get('/info',info_controller.info);

module.exports = router;