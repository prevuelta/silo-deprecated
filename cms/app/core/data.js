'use strict';

const fs = require('fs');
const { settings } = require('../../../config');
const Db = require('../db/db');
const glob = require('glob');
const path = require('path');

module.exports = {
    getPath(node) {
        return `${settings.dataDir}/${node}.json`;
    },
    getNodes() {
        const files = glob.sync(`${settings.dataDir}/*.json`);
        return files.map(f => path.basename(f, '.json'));
    },
    async getNode(node) {
        return new Promise((res, rej) => {
            const path = this.getPath(node);
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    const exists = fs.existsSync(path);
                    if (!exists) {
                        const didWriteFile = fs.writeFileSync(path, '');
                        const info = fs.statSync(path);
                        if (!didWriteFile) {
                            res({ data: '', meta: { modified: info.mtime } });
                        }
                    }
                    rej(err);
                } else {
                    const info = fs.statSync(path);
                    res({
                        data: data ? JSON.parse(data) : data,
                        meta: { modified: info.mtimeMs },
                    });
                }
            });
        });
    },
    async updateNode(node, { meta, data }) {
        return new Promise((res, rej) => {
            const path = this.getPath(node);
            let metaData;

            try {
                metaData = fs.statSync(path, 'utf-8');

                if (metaData.mtimeMs > meta.modified) {
                    rej('Stored content is newer, please try again');
                    return;
                }
            } catch (err) {
                console.log(err);
            }

            fs.writeFile(path, JSON.stringify(data), err => {
                return err ? rej(err) : res(data);
            });
        });
    },
};
