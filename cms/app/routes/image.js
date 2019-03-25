'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');
const path = require('path');
const fs = require('fs');

const multer = require('multer');
const glob = require('glob');
const im = require('gm').subClass({ imageMagick: true });
const readChunk = require('read-chunk');
const fileType = require('file-type');

const { settings } = require('../../../config');

const ALLOWED_FILES = ['.jpg', '.png', '.gif', '.jpeg'];
const { fileDir, tmpDir } = settings;

const router = express.Router();

// let silos;
// require('../core/silos').then(data => {
// silos = data;
// });

const THUMB_SIZE = 200;

router.get('/thumb/:asset', (req, res) => {
    const { asset } = req.params;
    const filePath = path.join(process.cwd(), settings.fileDir, asset);
    const { ext, name } = path.parse(asset);
    const thumbPath = path.join(
        process.cwd(),
        settings.tmpDir,
        `${name}_thumb${ext}`
    );
    const typeData = fileType(
        readChunk.sync(filePath, 0, fileType.minimumBytes)
    );

    if (typeData.mime.includes('image')) {
        fs.stat(thumbPath, (err, data) => {
            if (err) {
                im(filePath)
                    .resize(THUMB_SIZE)
                    .write(thumbPath, err => {
                        res.sendFile(thumbPath);
                    });
            } else {
                res.sendFile(thumbPath);
            }
        });
    } else {
        res.sendStatus(HttpStatus.NOT_FOUND);
    }
});

router.get('/:size/:asset', function(req, res) {
    const { size, asset } = req.params;
    const { name, ext } = path.parse(asset);
    // let filePath = `${tmpDir}/${fileName}_${size}.${extension}`;
    // fs.stat(filePath, (err, data) => {
    //     if (!err) {
    //         res.sendFile(filePath);
    //     } else {
    //         im(`${fileDir}/${resource}`)
    //             .resize(size)
    //             .write(filePath, err => {
    //                 res.sendFile(filePath);
    //             });
    //     }
    // });
});

module.exports = router;
