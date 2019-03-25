'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const { adminController } = require('../controllers');

const router = express.Router();

router.use(auth.jwt);
router.get('/', adminController.getInfo);

module.exports = router;
