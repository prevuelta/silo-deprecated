'use strict';

import React, { Component } from 'react';
import { AssetManager } from '../components';

class AssetsView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <section>
                <header>
                    <h2>Assets</h2>
                </header>
                <AssetManager />
            </section>
        );
    }
}

export default AssetsView;
