'use strict';

import React from 'react';
import { store } from '../modules';

export default {
    alert(message) {
        store.addMessage({ message, type: 'warning' });
    },
    message(message) {
        store.addMessage({ message });
    },
    component: props => (
        <div id="message">
            {props.messages.map((m, i) => {
                return (
                    <div key={i} className={(m.type || '') + ' message'}>
                        {m.message}
                    </div>
                );
            })}
        </div>
    ),
};
