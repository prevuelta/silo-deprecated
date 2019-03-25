'use strict';

const glob = require('glob');
const path = require('path');

let routes = {};

let files = glob.sync(`${__dirname}/*`);

files.forEach(file => {
    let base = path.basename(file, '.js');
    if (base !== 'index')
        routes[base] = require(path.join(__dirname, base));
});

module.exports = routes;
