'use strict';

const HttpStatus = require('http-status-codes');
const Users = require('../core/users');
const Silo = require('../core/silo');
const { settings } = require('../../../config');

module.exports = {
    getInfo: (req, res, next) => {
        res.render('pages/app', {
            user: req.session.user,
            title: settings.siteName,
            name: Silo.name,
            hooks: Silo.hooks,
            process,
        });
    },
};
