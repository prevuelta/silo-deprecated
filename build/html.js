'use strict';

const pug = require('pug');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const im = require('gm').subClass({ imageMagick: true });
const { fileDir, dataDir } = require('../config/settings');
const Promise = require('bluebird');

const data = {
    site: require('../config/site.json'),
};

const CHAR_LIMIT = 50;

function getImagePath(imagePath) {
    return `/assets/${imagePath}`;
}

function imageSize(imagePath, size) {
    const partials = path.parse(imagePath);
    const filename = `${partials.name}${size ? `_${size}` : ''}${partials.ext}`;
    const url = `/assets/${filename}`;
    const tmpPath = path.join(process.cwd(), 'dist', url);
    const filePath = `${process.cwd()}/${fileDir}/${imagePath}`;
    if (!fs.existsSync(tmpPath) && size) {
        im(filePath)
            .resize(size)
            .write(tmpPath, err => {
                if (err) {
                    console.log('Err', err);
                }
            });
    }
    return url;
}

const datas = glob.sync(`${dataDir}/*`);

datas.forEach(f => {
    const partials = path.parse(f);
    data[partials.name] = require(path.join(process.cwd(), f));
});

glob(path.join(__dirname, '../src/views/pages/*.pug'), (err, files) => {
    files.forEach(f => {
        let newPath = f.split('/').pop();
        newPath = newPath.replace('.pug', '.html');
        const newData = getData({ ...data, path: '/' + newPath });
        let html = pug.renderFile(f, newData);
        fs.writeFileSync(path.join(__dirname, '../dist/', newPath), html);
    });
});

function truncString(str) {
    return str && str.length > CHAR_LIMIT
        ? `${str.slice(0, CHAR_LIMIT)}...`
        : str;
}

function getData(data) {
    return { ...data, imageSize, getSlug, guid, truncString, getImagePath };
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return 'uuid-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
}

function getSlug(str) {
    return str
        .replace(/[^A-Za-z0-9 _-ā]/g, '')
        .replace(/_/g, '-')
        .replace(/ /g, '-')
        .toLowerCase();
}

function generatePage(templatePath, data, output) {
    templatePath = path.join(__dirname, templatePath);
    let html = pug.renderFile(templatePath, data);
    fs.writeFileSync(path.join(__dirname, output), html);
}
