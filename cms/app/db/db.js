'use strict';

const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const { settings } = require('../../../config');
const fs = require('fs');
const path = require('path');

let db;

if (!settings.dbPath || !settings.siteDir) {
    throw new Error('Please specify a valid database path');
}

const dbPath = path.join(settings.siteDir, settings.dbPath);
const dbExists = fs.existsSync(dbPath);

if (dbExists) {
    db = new sqlite3.Database(dbPath);
} else {
    throw new Error(`Database does not exist at ${dbPath}`);
}

function Db() {
    return {
        queries: 0,
        close() {
            // if (!this.queries) return db.close();
        },
        async run(query, data) {
            this.queries++;
            return new Promise((resolve, reject) => {
                db.run(query, data, (err, row) => {
                    this.queries--;
                    this.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        },
        async query(type, query, data) {
            this.queries++;
            return new Promise((resolve, reject) => {
                try {
                    db[type](query, data, (err, row) => {
                        this.queries--;
                        this.close();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    });
                } catch (e) {
                    this.queries--;
                    reject(e);
                }
            });
        },
        get(query, data, cb) {
            return this.query('get', query, data, cb);
        },
        all(query, data = {}, cb) {
            return this.query('all', query, data, cb);
        },
    };
}

module.exports = Db;
