'use strict';

// process.chdir('./cms');

const path = require('path');
const fs = require('fs');

/* Server */
const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const flash = require('flash');
const pug = require('pug');
const http = require('http');

/* Silo */
const { settings } = require('../../config');
const auth = require('./middleware/auth.js');

/* Setup */
const siteDir = __dirname;

/* Routes */
const Routes = require('./routes/index');

const app = express();

const { fileDir } = settings;

app.locals.siteName = settings.siteName;
app.locals.siteDomain = settings.domain;

app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'pug');

app.use(
    session({
        secret: settings.sessionSecret,
        secure: true,
        domain: settings.domain,
    })
);

app.use(flash());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

auth.init(app);

const assetPath = path.join(process.cwd(), fileDir);

app.use(express.static(path.join(process.cwd(), '/cms/client/public')));
app.use('/assets', express.static(assetPath));
app.use(
    '/assets',
    express.static(`${process.cwd()}/node_modules/react-datepicker/dist`)
);

/* Routes */
app.use('/', Routes.root);

app.use('/admin/data/schema', Routes.schema);
app.use('/admin/data/asset', Routes.assets);
app.use('/admin/data/user', Routes.users);
app.use('/admin/data/token', Routes.token);
app.use('/admin/action', Routes.actions);
app.get('/admin/logout', (req, res) => {
    console.log('logout');
    req.session = null;
    req.logout();
    res.cookie('jwt', '', { expires: new Date() });
    res.redirect('/');
});

app.use('/admin/:section/:node?', Routes.admin);
app.use('/api', Routes.api);
app.use('/image', Routes.image);
app.use('/hook', Routes.hook);

/* HTTP */
let server = http.createServer(app).listen(settings.port);
console.log(`Server listening on: ${settings.port}`);
