'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');
const Silo = require('../core/silo');
require('isomorphic-fetch');

const router = express.Router();

router.use(auth.jwt);

// let silos;
// require('../core/silos').then(data => {
// silos = data;
// });

router.get('/:resource?/:hook?', (req, res, next) => {
    let { resource, hook } = req.params;
    if (resource && hook) {
        const resourceData = silos.getResource(resource);
        if (resourceData && resourceData.webHooks[hook]) {
            let hookData = resourceData.webHooks[hook];
            fetch(hookData.url, {
                headers: hookData.headers,
                timeout: 50000,
            })
                .then(result => {
                    if (result.status === 200) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                });
        } else {
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } else {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
