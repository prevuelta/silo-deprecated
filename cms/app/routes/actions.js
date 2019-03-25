'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');
const execSync = require('child_process').sync;

const Silo = require('../core/silo');

const router = express.Router();

router.use(auth.jwt);

router.route('/rebuild').get((req, res, next) => {
    Silo.rebuildSite()
        .then(code => {
            res.send(HttpStatus.SUCCESS);
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
});

module.exports = router;
