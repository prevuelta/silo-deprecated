'use strict';

import React from 'react';
import Icon from './icons';

export default props => {
    const classes = props.full ? 'modal-full' : '';
    return props.isVisible ? (
        <div id="overlay">
            <div id="modal" className={classes}>
                {props.close && (
                    <button
                        type="button"
                        className="close-modal"
                        onClick={props.close}>
                        <Icon.X />
                    </button>
                )}
                {props.children}
            </div>
        </div>
    ) : null;
};
