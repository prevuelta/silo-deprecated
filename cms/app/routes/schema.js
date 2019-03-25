'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');

let router = express.Router();

const Silo = require('../core/silo');

router
    .route('/')
    .all(auth.api)
    .get((req, res) => {
        const schemas = Silo.getSchemas();
        res.send({
            schemas,
        });
    });

module.exports = router;
