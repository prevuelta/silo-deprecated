'use strict';

function replace(key, node, widgets, uiSchema, path) {
    if (node && node.format && widgets[node.format]) {
        if (key) {
            uiSchema[key] = widgets[node.format];
        } else {
            Object.assign(uiSchema, widgets[node.format]);
        }
    } else if (node.items) {
        if (node.items.format && widgets[node.items.format]) {
            uiSchema.items = widgets[node.items.format];
        } else {
            uiSchema.items = {};
            replace('items', node.items, widgets, uiSchema.items);
        }
    } else if (node.properties) {
        Object.keys(node.properties).forEach(k => {
            uiSchema[k] = {};
            const newNode = node.properties[k];
            if (newNode.format && widgets[newNode.format]) {
                uiSchema[k] = widgets[newNode.format];
            } else {
                replace(k, node.properties[k], widgets, uiSchema[k]);
            }
        });
    }
}

function clear(uiSchema, parent, key) {
    if (typeof uiSchema === 'object') {
        Object.keys(uiSchema).forEach(k => {
            const node = uiSchema[k];
            if (Object.keys(node).length) {
                clear(uiSchema[k], uiSchema, k);
            } else {
                delete uiSchema[k];
            }
        });
    }
}

function generateUISchema(schema, widgets) {
    const uiSchema = {};
    replace(null, schema, widgets, uiSchema, []);
    return uiSchema;
}

export default generateUISchema;
