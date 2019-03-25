'use strict';

import React, { Component } from 'react';
const { Fragment } = React;

export default class CustomFieldTemplate extends Component {
    constructor(props) {
        super(props);
        const { type } = props.schema;
        const isObject = type === 'object';
        const isRoot = props.id === 'root';
        // Figure out way to have all collapsed except array items
        this.state = {
            collapsed: props.children.props.isInArray
                ? false
                : isObject && !isRoot,
            type,
            isObject: type === 'object',
            isArray: type === 'array',
            isRoot,
        };
    }
    _toggleCollapsed() {
        this.setState({ collapsed: !this.state.collapsed });
    }
    componentWillReceiveProps(newProps) {
        const { type } = newProps.schema;
        this.setState({
            type,
            isObject: type === 'object',
            isArray: type === 'array',
            isRoot: newProps.id === 'root',
        });
    }
    render() {
        const {
            id,
            classNames,
            label,
            help,
            required,
            description,
            errors,
            children,
        } = this.props;
        const { collapsed, isObject, isArray, isRoot, type } = this.state;
        const { formData } = children.props;
        let showTitle = !isArray || isObject;
        if (type === 'boolean') {
            showTitle = false;
        }
        let Title = (
            <label htmlFor={id}>
                {label}
                {required ? '*' : null}
            </label>
        );
        if (isObject && !isRoot) {
            Title = (
                <label
                    className="object-title"
                    htmlFor={id}
                    onClick={() => this._toggleCollapsed()}>
                    {label}
                </label>
            );
        }
        return (
            <div className={`${classNames} ${collapsed ? 'collapsed' : ''}`}>
                {showTitle && Title}
                {!collapsed && (
                    <Fragment>
                        {description}
                        {children}
                        {errors}
                        {help}
                    </Fragment>
                )}
            </div>
        );
    }
}
