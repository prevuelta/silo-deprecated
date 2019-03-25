'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { settings } = require('../../../config');

const router = express.Router();

router.get('/', (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (!user) {
            res.render('pages/login');
        } else {
            res.redirect('/admin/manage');
        }
    })(req, res, next);
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err);
        }
        if (!user) {
            req.flash('info', 'Username or password incorrect');
            res.render('pages/login');
        } else {
            let token = jwt.sign({ user: user.id }, settings.jwt.secret, {
                expiresIn: '3 days',
                issuer: settings.jwt.issuer,
            });
            res.cookie('jwt', token);
            req.session.user = {
                id: user.id,
                username: user.username,
                isAdmin: user.admin,
            };
            req.session.flash = [];
            res.redirect('/admin/manage');
        }
    })(req, res, next);
});

module.exports = router;
