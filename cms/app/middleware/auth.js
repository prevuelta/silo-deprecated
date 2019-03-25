'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const HttpStatus = require('http-status-codes');
const { settings } = require('../../../config');

const Users = require('../core/users');
const Consumers = require('../core/consumers');

const extractFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken();

const cookieOrHeader = req => {
    if (req && req.cookies && req.cookies['jwt']) {
        return req.cookies['jwt'];
    } else {
        return extractFromHeader(req);
    }
};

const localAuthOptions = {
    successRedirect: '/admin/content',
    failureRedirect: '/',
    sessionSecret: settings.sessionSecret,
    failureFlash: true,
    session: false,
};

const jwtAuthOptions = {
    jwtFromRequest: cookieOrHeader,
    secretOrKey: settings.jwt.secret,
    session: false,
    passReqToCallback: true,
    issuer: settings.jwt.issuer,
};

passport.use(
    'jwt',
    new JwtStrategy(jwtAuthOptions, (req, jwt_payload, done) => {
        if (req.session.user) {
            done(null, req.session.user);
        } else {
            Users.getUserById(jwt_payload.user)
                .then(user => {
                    if (!user) {
                        done('No such user');
                    }
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        isAdmin: user.admin,
                        role: user.role,
                    };
                    done(null, user);
                })
                .catch(err => {
                    console.log(err);
                    done('Authentication failed', null);
                });
            // done('Authentication failed', null);
        }
    })
);

passport.use(
    'api',
    new JwtStrategy(jwtAuthOptions, (req, jwt_payload, done) => {
        if (jwt_payload.user && Users) {
            Users.getUserById(jwt_payload.user)
                .then(user => {
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, {}, 'Authentication failed');
                    }
                })
                .catch(done);
        } else if (jwt_payload.consumer) {
            Users.getConsumerById(jwt_payload.consumer)
                .then(consumer => {
                    if (consumer) {
                        done(null, consumer);
                    } else {
                        done(null, {}, 'Authentication failed');
                    }
                })
                .catch(done);
        } else {
            done(null, false, 'Api authentication failed');
        }
    })
);

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        const message = { message: 'Authentication Failed' };
        Users.authenticateUser({ email, password })
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false, message);
                }
            })
            .catch(err => {
                console.log(err);
                return done(err, false, message);
            });
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    Users.getUserById(id)
        .then(user => done(null, user))
        .catch(done);
});

module.exports = {
    init(app) {
        app.use(passport.initialize());
        app.use(passport.session());
    },
    jwt: passport.authenticate('jwt', {
        ...jwtAuthOptions,
        failureRedirect: '/',
    }),
    api: passport.authenticate('api', jwtAuthOptions),
    local: passport.authenticate('local', localAuthOptions),
    loggedIn(req, res, next) {
        // Check if user has valid jwt, if so log them in

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) return next();

        // if they aren't redirect them to the home page
        res.redirect(localAuthOptions.failureRedirect);
    },
    isAdmin(req, res, next) {
        if (req.session.user && req.session.user.isAdmin) {
            return next();
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }

        // if (req.isAuthenticated()) {
        //     Core.userIsAdmin(req.session.user.id)
        //         .then(result => {
        //             if (result) {
        //                 return next();
        //             } else {
        //                 res.redirect(localAuthOptions.failureRedirect);
        //             }
        //         })
        //         .catch(err => res.redirect(localAuthOptions.failureRedirect));
        // } else {
        //     res.redirect(localAuthOptions.failureRedirect)
        // }
    },
    resourcePermission(req, res, next) {
        // if (req.isAuthenticated()) {
        let { id } = req.session.user;
        Core.getResourcesByUserId(id)
            .then(resources => {
                let canView = resources.some(s => {
                    return s.USER === id && s.RESOURCE === req.params.silo;
                });
                if (canView) {
                    next();
                } else {
                    res.sendStatus(401);
                }
            })
            .catch(err => {
                res.sendStatus(500);
            });
        // } else {
        // res.redirect(localAuthOptions.failureRedirect);
        // }
    },
};
