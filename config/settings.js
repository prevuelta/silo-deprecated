'use strict';

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { env } = process;

const defaults = {
    dbPath: 'cms/app/db/app.db',
    schemaDir: 'schema',
    fileDir: 'assets',
    dataDir: 'data',
    tmpDir: 'tmp',
};

module.exports = {
    domain: env.DOMAIN,
    siteDir: env.SITE_DIR,
    siteName: env.SITE_NAME,
    dbPath: env.DB_PATH || defaults.dbPath,
    schemaDir: env.SCHEMA_PATH || defaults.schemaDir,
    fileDir: env.FILE_DIR || defaults.fileDir,
    dataDir: env.DATA_DIR || defaults.dataDir,
    tmpDir: env.TMP_DIR || defaults.tmpDir,
    sessionSecret: env.SESSION_SECRET,
    jwt: {
        secret: env.JWT_SECRET,
        issuer: env.JWT_ISSUER,
    },
    port: env.PORT,
};
