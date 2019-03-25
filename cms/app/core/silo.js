'use strict';

const $RefParser = require('json-schema-ref-parser');
const Promise = require('bluebird');
const glob = require('glob');
const path = require('path');
const { spawn } = require('child_process');
const { settings } = require('../../../config');
const fs = require('fs');
const Data = require('./data');

const Ajv = require('ajv');
let ajv = new Ajv({
    v5: true,
    removeAdditional: 'all',
    // unknownFormats: ['image', 'textarea', 'markup', 'geo', 'asset'],
    formats: {
        image: value => typeof value === 'object',
        textarea: value => typeof value === 'string',
        markup: value => typeof value === 'string',
        asset: value => typeof value === 'string',
        geo: value => typeof value === 'object',
        checkboxes: value => typeof value === 'array',
    },
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
require('ajv-merge-patch')(ajv);

const protectedSchemaName = 'silo-definitions';
const protectedSiloNames = ['admin', 'silo', 'files', 'assets'];

// const newProps = {
//     _created: { type: 'number' },
//     _modified: { type: 'number' },
// };

const schemas = {};
const validations = {};
const defResolver = {
    order: 1,
    canRead: /silo*/,
    read: (file, cb) => {
        fs.readFile(
            `${process.cwd()}/cms/app/default-schema/silo-definitions.json`,
            cb
        );
    },
};

let loaded = false;

const schemaPath = `${path.join(settings.siteDir, settings.schemaDir)}/!(_*)`;
const schemaFiles = glob.sync(schemaPath);

const schemaPromises = Promise.map(schemaFiles, s => {
    const schema = require(s);
    const name = path.basename(s, '.json');
    if (name.includes(protectedSchemaName)) {
        throw new Error(`'${name}' is a protected schema name`);
    }
    let dir = path.dirname(s);
    let ref = $RefParser.dereference(`${dir}/`, schema, {
        resolve: { def: defResolver },
    });
    return ref
        .then(dereferencedSchema => {
            schemas[name] = dereferencedSchema;
            schemas[name].$id = name;
            ajv.addSchema(dereferencedSchema);
            // const patchedSchema = {
            // $merge: {
            // source: { $ref: name },
            // with: {
            // properties: newProps,
            // items: { properties: newProps },
            // },
            // },
            // };
            validations[name] = ajv.compile(dereferencedSchema);
            return true;
        })
        .catch(err => console.log(err));
});

schemaPromises.then(thing => {
    loaded = true;
});

//     ajv: ajv,
//     validate: validations,

module.exports = {
    validations,
    isRebuilding: false,
    rebuildSite() {
        if (!this.rebuilding) {
            this.rebuilding = true;
            return new Promise((res, rej) => {
                const child = spawn('npm', ['run', 'build']);
                // const child = spawn('ls', ['-a', '-l']);

                process.stdin.pipe(child.stdin);

                child.stdout.on('data', data => {
                    console.log(`Site build: ${data}`);
                });

                child.on('exit', code => {
                    console.log('Exit', code);
                    this.rebuilding = false;
                    res(code);
                });

                child.on('error', err => {
                    console.log('Site build error', err);
                    this.rebuilding = false;
                    rej(err);
                });
                // child.on('message', msg => {
                // jkk
                // })
            });
        }
    },
    getSchemas() {
        return loaded ? Object.keys(schemas) : [];
    },
    getUsers() {
        return Data.getUsers();
    },
    getNodes() {
        return Data.getNodes();
    },
    getNode(node, sendSchema) {
        if (!loaded) {
            return new Promise();
        }
        const data = Data.getNode(node);
        return data.then(result => {
            return sendSchema
                ? {
                      schema: schemas[node],
                      data: result.data,
                      meta: result.meta,
                  }
                : result;
        });
    },
    updateNode(node, data) {
        if (this.validations[node] && !this.validations[node](data.data)) {
            console.log('Error', this.validations[node].errors);
            return Promise.reject('Invalid Data');
        }
        // Validate the node!!!
        return Data.updateNode(node, data);
    },
    nodeExists(node) {
        return !!schemas[node];
    },
    getInfo() {
        return {
            name: 'test',
            title: 'Test',
            hooks: [],
        };
    },
};
// .then(schema => {
// const webhooksRaw;
// let info;
// try {
// webhooksRaw = fs.readFileSync(`${f}/webhooks.json`);
// } catch (e) {}
// resources.getResource(resource).webHooks = [];
// if (webhooksRaw) {
// resources.getResource(resource).webHooks = JSON.parse(
// webhooksRaw
// );
// }
// const resourceData = resources.getResource(resource);
// try {
// info = fs.readFileSync(`${f}/info.json`);
// } catch (e) {}
// if (info) {
// resourceData.info = JSON.parse(info);
// }
// resourceData.title =
// (resourceData.info && resourceData.info.title) || resource;
// return Mongo(`silo_${resource}`)
// .then(db => {
// resourceData.init(db);
// })
// .catch(console.log);
// })
// .catch(err => console.log(err));
// });
// const validations = {};
// for (key in schemas) {
//     const schema = schemas[key];
//     schema.$id = key;
//     ajv.addSchema(schema);
//     const patchedSchema = {
//         $merge: {
//             source: { $ref: key },
//             with: {
//                 properties: newProps,
//                 items: { properties: newProps },
//             },
//         },
//     };
//     validations[key] = ajv.compile(patchedSchema);
// }

// return {
//     ajv: ajv,
//     validate: validations,
//     schemas,
//     // nodeName(str) {
//     // return str.replace(`${this.name}_`, '');
//     // },
//     addFile(file) {
//         // const collection = this.db.getCollection('_files');
//         // return collection.insert(file);
//     },
//     removeFile(_id) {
//         // const collection = this.db.getCollection('_files');
//         // return collection.remove({ _id: ObjectId(_id) });
//     },
//     getFile(_id) {
//         // const collection = this.db.getCollection('_files');
//         // return collection.findOne({ _id: ObjectId(_id) });
//     },
//     getAllFiles() {
//         // const collection = this.db.getCollection('_files');
//         // return collection.find({}).toArray();
//     },
//     init() {},
//     getAll() {},
//     getNode(node, sendSchema) {
//         const data = Data.getNode(node);
//         return collection
//             .find({})
//             .toArray()
//             .then(data => {
//                 const schema = this.getSchema(node);
//                 if (schema.type == 'object') data = data[0];
//                 return sendSchema
//                     ? {
//                           schema,
//                           data,
//                       }
//                     : data;
//             });
//     },
//     updateOne(collection, doc) {
//         if (!doc) {
//             return Promise.reject();
//         }

// doc._id = this.db.ObjectId(doc._id);

// let find = collection
//     .find({
//         _id: this.db.ObjectId(doc._id),
//     })
//     .toArray();

// return find.then(res => {
//     if (res.length === 1) {
//         if (res[0]._modified === doc._modified) {
//             doc._modified = Date.now();
//             return collection
//                 .updateOne(
//                     {
//                         _id: this.db.ObjectId(doc._id),
//                     },
//                     {
//                         $set: doc,
//                     }
//                 )
//                 .then(res => {
//                     return res.result;
//                 });
//         } else {
//             return Promise.reject({
//                 err: `Record ${doc._id} not updated`,
//             });
//         }
//     } else {
//         doc._created = Date.now();
//         return collection
//             .insertOne(doc)
//             .then(result => result.result);
//     }
// });
// },
// getSchema(schema) {
// return this.schema[schema];
// },
// update(node, doc) {
// if (!doc) {
//     return Promise.reject('No document data');
// }
// const schemaName = `${this.name}_${node}`;
// if (this.validate[schemaName] && !this.validate[schemaName](doc)) {
//     console.log('Error', this.validate[schemaName].errors);
//     return Promise.reject('Invalid Silo Data');
// }
// if (Array.isArray(doc)) {
//     if (doc.some(d => Array.isArray(d))) {
//         return Promise.reject('Document must be object');
//     }
//     const ids = doc.filter(d => d._id).map(d => d._id);
//     const collectionName = this.collectionName(node);
//     const collection = this.db.getCollection(collectionName);
//     let updatePromise = Promise.map(doc, d => {
//         return this.updateOne(collection, d);
//     });

// let deletePromise = collection
//     .find({})
//     .toArray()
//     .then(results => {
//         return Promise.map(results, result => {
//             if (!ids.some(id => result._id.equals(id)))
//                 return collection.deleteOne({
//                     _id: result._id,
//                 });
//             return Promise.resolve();
//         });
//     });

// return Promise.all(updatePromise, deletePromise);
// } else {
// const collectionName = this.collectionName(node);
// const collection = this.db.getCollection(collectionName);
// return new Promise.resolve([this.updateOne(collection, doc)]);
// }
// },
// };
// };
