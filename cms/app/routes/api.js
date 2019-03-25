'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');

let router = express.Router();

const Silo = require('../core/silo');

router
    .route('/:node?')
    .all(auth.api)
    .get((req, res) => {
        const { node } = req.params;
        if (!node) {
            const nodes = Silo.getNodes();
            res.send({
                nodes,
            });
            // const dataObk = Silo.getData(data);
            // if (!resourceObj) {
            // res.sendStatus(HttpStatus.UNAUTHORIZED);
            // } else {
            // resourceObj
            // .getAll()
            // .then(result => {
            // res.send({
            // collections: result,
            // resource,
            // });
            // })
            // .catch(err => {
            // res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            // });
        } else {
            Silo.getNode(node, req.query.schema)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    console.log('Error', err);
                    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                });
        }
        // } else {
        // silos
        // .getResource(resource)
        // .getNode(node, req.query.schema)
        // .then(result => {
        // if (result) {
        // res.send(result);
        // } else {
        // res.sendStatus(HttpStatus.BAD_REQUEST);
        // }
        // })
        // .catch(err => {
        // console.warn(err);
        // res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        // });
        // }
        // res.sendStatus(HttpStatus.UNAUTHORIZED);
    })
    .post((req, res) => {
        const { body } = req;
        const { node } = req.params;
        if (Silo.nodeExists(node)) {
            Silo.updateNode(node, body)
                .then(data => {
                    res.send(HttpStatus.SUCCESS);
                })
                .catch(err => {
                    console.log(err);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
                });
        }
        //if (req.resources && req.resources.length > 0) {
        //    let resource = req.resources.find(
        //        r => r.resource === req.params.resource
        //    );
        //    if (resource && resource.role > 1) {
        //        let { resource, node } = req.params;
        //        if (resource && node) {
        //            let data = req.body;
        //            if (
        //                !silos.resourceExists(resource) ||
        //                !data ||
        //                Object.keys(data).length === 0
        //            ) {
        //                res.sendStatus(HttpStatus.BAD_REQUEST);
        //            } else {
        //                //TODO: Check modified date here and throw accurate error
        //                silos
        //                    .getResource(resource)
        //                    .update(node, data.formData)
        //                    .then(result => {
        //                        if (result.some(r => r.err)) {
        //                            res.send(
        //                                JSON.stringify(
        //                                    result.filter(r => r.err)
        //                                )
        //                            );
        //                        } else {
        //                            res.send(
        //                                JSON.stringify({
        //                                    result: HttpStatus.OK,
        //                                })
        //                            );
        //                        }
        //                    })
        //                    .catch(err => {
        //                        console.log(err);
        //                        res.sendStatus(
        //                            HttpStatus.INTERNAL_SERVER_ERROR
        //                        );
        //                    });
        //            }
        //        } else {
        //            res.sendStatus(HttpStatus.BAD_REQUEST);
        //        }
        //    } else {
        //        res.sendStatus(HttpStatus.UNAUTHORIZED);
        //    }
        //}
    });

module.exports = router;
