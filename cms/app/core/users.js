'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');
const Db = require('../db/db');

const db = Db();

const schema = Joi.object().keys({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    hash: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    created: Joi.date().required(),
    admin: Joi.boolean()
        .default(false)
        .required(),
    resources: Joi.array().items(
        Joi.object({ role: Joi.string(), resource: Joi.string() }).required()
    ),
});

module.exports = {
    async getAll() {
        return db.all(`SELECT * FROM user`);
    },
    async getUserById(id) {
        return db.get('SELECT * FROM user WHERE id = ?', { 1: id });
    },
    async getUserByName(name) {
        return db.get('SELECT * FROM user WHERE username = ?', { 1: username });
    },
    async getUserByEmail(email) {
        return db.get('SELECT * FROM user WHERE email  = ?', { 1: email });
    },
    async authenticateUser(creds) {
        return this.getUserByEmail(creds.email).then(user => {
            if (user && bcrypt.compareSync(creds.password, user.hash)) {
                return user;
            } else {
                throw new Error('Authentication failed');
                return null;
            }
        });
    },
    createUser(data) {
        const valid = Joi.validate(data, schema);
        if (valid) {
            let values = Object.keys(data).map(k => data[k]);
            let q = `INSERT INTO user(${Object.keys(data).join(
                ','
            )}) VALUES(${Object.keys(data)
                .map(k => '?')
                .join(', ')})`;
            return db.run(q, values);
        } else {
            console.log('User data invalid');
        }
    },
    updateUser(id, data) {
        const valid = Joi.validate(data, schema);
        if (valid) {
            let values = Object.values(data);
            let q = `UPDATE user SET ${Object.keys(data)
                .map(key => `${key} = ?`)
                .join(', ')} WHERE id = ?`;
            return db.run(q, [...values, id]);
        }
    },
    deleteUser(id) {
        return db.run('DELETE FROM user WHERE id = ?', [id]);
    },
    resourcePermissions(resource, id) {
        // return this.getUserById(id).then(user => {
        // return (
        // (user &&
        // user.resources &&
        // user.resources.find(r => r.resource === resource)) ||
        // []
        // );
        // });
    },
    async getResourcesById(id) {
        return db
            .all(
                'SELECT * FROM resource_permissions WHERE resource_permissions.user = ?',
                { 1: id }
            )
            .then(permissions => {
                return permissions || [];
            });
    },
};
