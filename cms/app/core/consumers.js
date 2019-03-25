'use strict';

// const Connection = require('./connection');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const consumerSchema = Joi.object().keys({
    name: Joi.string().required(),
    created: Joi.date().required(),
    resource: Joi.string().required(),
});

module.exports = {
    getAll() {
        return collection.find({}).toArray();
    },
    getConsumerById(_id) {
        // const record = collection.findOne({ _id: ObjectId(_id) });
        // return record;
    },
    createConsumer(data) {
        // const valid = Joi.validate(data, consumerSchema);
        // if (valid) {
        // return collection.insert(data);
        // } else {
        // return null;
        // }
    },
    removeConsumer(_id) {
        // return collection.remove({ _id: ObjectId(_id) });
    },
    resourcePermissions(resource, id) {
        // return this.getConsumerById(id).then(consumer => {
        // return consumer.resource === resource;
        // });
    },
    getResourceById(id) {
        // return this.getConsumerById(id).then(consumer => {
        // if (consumer) {
        // return consumer.resource;
        // } else {
        // return null;
        // }
        // });
    },
};
