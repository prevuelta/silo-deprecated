'use strict';

import React, { Component } from 'react';
import ContentForm from '../components/contentForm';
import { Req, Loader, Notify } from '../util';
import { store } from '../modules';

class ContentView extends Component {
    constructor(props) {
        super(props);
        const { resource } = props.match.params;
        this.state = {
            meta: null,
            data: null,
            schema: null,
            resource,
        };
        if (resource) {
            this._loadContent(resource);
        }
    }

    componentWillReceiveProps(newProps) {
        const { resource } = newProps.match.params;
        if (this.state.resource !== resource) {
            store.set('isLoading', true);
            this.setState({ resource }, () => {
                this._loadContent(resource);
            });
        }
    }

    _loadContent(resource) {
        Req(`/api/${resource}?schema=true`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: res.data || (res.schema.type === 'object' ? {} : []),
                    meta: res.meta,
                    schema: res.schema,
                });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                store.set('isLoading', false);
            });
    }

    _saveContent(data) {
        store.set('isLoading', true);
        Req(`/api/${this.state.resource}`, 'POST', {
            data: data.formData,
            meta: this.state.meta,
        })
            .then(res => {
                if (res.status === 200) {
                    Notify.message('Document saved');
                } else {
                    Notify.alert('Problem saving document');
                }
                window.scrollTo(0, 0);
                this._loadContent(this.state.resource);
            })
            .catch(err => {
                if (err) {
                    err.text().then(errText => {
                        Notify.alert(errText || 'Problem saving document');
                    });
                } else {
                    Notify.alert('Problem saving document');
                }
            })
            .finally(() => {
                store.set('isLoading', false);
            });
    }

    render() {
        const { data, meta, schema } = this.state;
        return data ? (
            <ContentForm
                data={data}
                meta={meta}
                schema={schema}
                onSubmit={data => this._saveContent(data)}
            />
        ) : (
            <Loader />
        );
    }
}

export default ContentView;
