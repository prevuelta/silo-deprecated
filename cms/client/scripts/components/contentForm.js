'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird'; // 200k
import Form from 'react-jsonschema-form';
import moment from 'moment';
// import SchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import { Req, Loader, Notify, generateUISchema } from '../util';
import {
    ImageField,
    DateField,
    DateTimeField,
    AssetField,
    MarkupField,
    GeoField,
} from '../components';

import { ArrayFieldTemplate, ArrayItem, CustomFieldTemplate } from '.';

const { Fragment } = React;

const CustomTitleField = ({ title, required }) => {
    const legend = required ? title + '*' : title;
    return null; //<h2>{legend}</h2>;
};

class CustomSchemaField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { formData } = this.props;
        const title =
            (formData && formData.title) ||
            this.props.schema.title ||
            this.props.schema.type;
        return <SchemaField {...this.props} />;
    }
}

const fields = {
    image: ImageField,
    date: DateField,
    dateTime: DateTimeField,
    asset: AssetField,
    markup: MarkupField,
    geo: GeoField,
    // TitleField: CustomTitleField,
    // SchemaField: CustomSchemaField,
};

const uiFields = {
    asset: { 'ui:field': 'asset' },
    image: { 'ui:field': 'image' },
    'date-time': { 'ui:field': 'dateTime' },
    date: { 'ui:field': 'date' },
    markup: { 'ui:field': 'markup' },
    geo: { 'ui:field': 'geo' },
    checkboxes: { 'ui:widget': 'checkboxes' },
};

export default class ContentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { schema, data, onSubmit, meta } = this.props;
        const modified = moment(meta.modified).format('ddd D MMM YYYY h:mma');
        const uiSchema = generateUISchema(schema, uiFields);
        return (
            <section className="nodes">
                <header>
                    <h2>{schema.title}</h2>
                    <p className="modified">Last modified: {modified}</p>
                </header>
                <Form
                    schema={schema}
                    formData={data}
                    uiSchema={uiSchema}
                    fields={fields}
                    ArrayFieldTemplate={ArrayFieldTemplate}
                    FieldTemplate={CustomFieldTemplate}
                    onSubmit={onSubmit}
                    onError={console.log}>
                    <button type="submit">Save</button>
                </Form>
            </section>
        );
    }
}
