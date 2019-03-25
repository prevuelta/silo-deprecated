'use strict';

import React, { Component } from 'react';
import ArrayItem from './arrayItem';

export default class ArrayFieldTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    _toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        const { props } = this;
        const { title } = props;
        const isRoot = props.idSchema.$id === 'root';
        return (
            <div className={props.className + (isRoot ? ' root' : '')}>
                <p
                    onClick={() => this._toggleCollapsed()}
                    className="header-button">
                    <label>
                        {title} ({props.items.length})
                    </label>
                    {!!props.items.length && (
                        <span>{this.state.collapsed ? '[ + ]' : '[ - ]'}</span>
                    )}
                </p>
                {props.items &&
                    !this.state.collapsed &&
                    props.items.map(element => (
                        <ArrayItem key={element.index} element={element} />
                    ))}
                <div>
                    <button
                        className="no-style"
                        onClick={props.onAddClick}
                        type="button">
                        + Add {props.schema.items.title}
                    </button>
                </div>
            </div>
        );
    }
}
