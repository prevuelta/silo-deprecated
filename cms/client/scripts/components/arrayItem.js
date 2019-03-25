'use strict';

import React, { Component } from 'react';

export default class ArrayItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
            title: this._getTitle(props),
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ title: this._getTitle(newProps) });
    }

    _getTitle(props) {
        const { formData, schema } = props.element.children.props;
        let title =
            formData && formData.title && typeof formData.title === 'string'
                ? formData.title
                : schema.title || schema.type;
        const { useAsTitle } = schema;
        if (useAsTitle) {
            try {
                const tmpTitle = useAsTitle
                    .split('.')
                    .reduce((a, b) => (a && a[b] ? a[b] : null), formData);
                if (tmpTitle) {
                    title =
                        tmpTitle.length > 35
                            ? tmpTitle.substring(0, 35) + '...'
                            : tmpTitle;
                }
            } catch (e) {
                console.warn(e);
            }
        }
        return title;
    }

    toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        const { element } = this.props;
        const { formData, schema } = element.children.props;
        const { useAsTitle, type } = schema;
        const canCollapse = true;
        const cls =
            this.state.collapsed && canCollapse
                ? 'field-wrapper array collapsed'
                : 'array field-wrapper';
        const action = this.state.collapsed ? 'Edit' : 'Collapse';
        const children = React.cloneElement(element.children, {
            isInArray: true,
        });
        const { title } = this.state;

        return (
            <div className={cls}>
                <div className="array-item-header">
                    <p
                        className="header-button"
                        onClick={() => this.toggleCollapsed()}>
                        {element.index + 1}. {title}
                        <span>{this.state.collapsed ? '[ + ]' : '[ - ]'}</span>
                    </p>
                    <div className="tools">
                        {element.hasMoveDown && (
                            <button
                                className="icon btn-down"
                                onClick={element.onReorderClick(
                                    element.index,
                                    element.index + 1
                                )}>
                                <svg
                                    viewBox="0,0,318,318"
                                    width="318"
                                    height="318"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M159 0l159 106-26.5 37.1-106-68.9V318h-53V74.2l-106 68.9L0 106 159 0z"
                                        strokeMiterlimit="10"
                                    />
                                </svg>
                            </button>
                        )}
                        {element.hasMoveUp && (
                            <button
                                className="icon btn-up"
                                onClick={element.onReorderClick(
                                    element.index,
                                    element.index - 1
                                )}>
                                <svg
                                    viewBox="0,0,318,318"
                                    width="318"
                                    height="318"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M159 0l159 106-26.5 37.1-106-68.9V318h-53V74.2l-106 68.9L0 106 159 0z"
                                        strokeMiterlimit="10"
                                    />
                                </svg>
                            </button>
                        )}
                        <button
                            type="icon button"
                            className="orange btn-delete"
                            onClick={element.onDropIndexClick(element.index)}>
                            <svg
                                viewBox="0,0,330,330"
                                width="330"
                                height="330"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 66l99 99-99 99 66 66 99-99 99 99 66-66-99-99 99-99-66-66-99 99L66 0z"
                                    strokeMiterlimit="10"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                {!this.state.collapsed && children}
            </div>
        );
    }
}
