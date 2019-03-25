'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { settings } = require('../../../config');
const Silo = require('../core/silo');
const Users = require('../core/users');

const router = express.Router();

router.use(auth.jwt);
router.use(auth.isAdmin);

router.post('/', (req, res) => {
    const { id } = req.body;
    Users.getUserById(id)
        .then(result => {
            if (result) {
                let token = jwt.sign(
                    { user: result._id },
                    settings.jwt.secret,
                    { issuer: settings.jwt.issuer }
                );
                res.send({
                    token,
                });
            } else {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            }
        })
        .catch(err => {
            console.warn(err);
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        });
});

module.exports = router;
