'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');

let router = express.Router();

const Users = require('../core/users');

router
    .route('/')
    .all(auth.jwt)
    .all(auth.isAdmin)
    .get((req, res) => {
        Users.getAll()
            .then(users => {
                const filteredUsers = users.map(u => {
                    return {
                        id: u.id,
                        username: u.username,
                        created: u.created,
                        email: u.email,
                        role: u.role,
                        admin: u.admin,
                    };
                });
                res.send(filteredUsers);
            })
            .catch(err => {
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            });
    })
    .post((req, res) => {
        // Check user session && role
        const user = req.body;

        const data = {
            username: user.username,
            email: user.email,
            admin: user.admin,
            role: +user.role,
        };

        if (!user.id) {
            data.created = +new Date();
            data.hash = bcrypt.hashSync(user.password);
            Users.createUser(data)
                .then(result => {
                    res.sendStatus(HttpStatus.OK);
                })
                .catch(err => {
                    console.warn(err);
                    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                });
        } else {
            Users.getUserById(user.id)
                .then(user => {
                    const updatedUser = { ...user, ...data };
                    delete updatedUser.id;
                    Users.updateUser(user.id, updatedUser)
                        .then(result => {
                            console.log('Result', result);
                            res.sendStatus(HttpStatus.OK);
                        })
                        .catch(err => {
                            console.warn(err);
                            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                        });
                })
                .catch(err => {
                    console.warn(err);
                    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                });
        }
    })
    .delete((req, res) => {
        // Check user session && role
        Users.deleteUser(req.body.id)
            .then(result => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch(err => {
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            });
    });

module.exports = router;
