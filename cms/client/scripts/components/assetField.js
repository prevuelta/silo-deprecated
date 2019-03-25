'use strict';

import AssetManager from './assetManager';
import Modal from './modal';
import React, { Component } from 'react';
import Req from '../util/request';
import moment from 'moment';
import { AssetPreview } from './assetManagerAsset';

class Asset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.formData,
            selectingAsset: false,
            asset: null,
        };
    }

    componentDidMount() {
        if (this.state.value) {
            this._getAssetInfo();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.formData !== this.state.value) {
            this.setState({ value: newProps.formData, asset: null }, () => {
                console.log('New props getting infop');
                this._getAssetInfo();
            });
        }
    }

    _getAssetInfo() {
        Req(`/admin/data/asset/${this.state.value}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then(info => {
                this.setState({ asset: info });
            })
            .catch(err => {
                console.log(err);
            });
    }

    _onChange(value) {
        this.setState({ value });
        this.props.onChange(value === '' ? undefined : value);
    }

    _toggleAssetManager(show = true) {
        this.setState({ selectingAsset: show });
    }

    _selectAsset(asset) {
        this.setState(
            {
                asset,
                value: asset.name,
            },
            () => this.props.onChange(this.state.value)
        );
    }

    render() {
        const { value, selectingAsset, asset } = this.state;
        const created =
            asset && moment(asset.ctime).format('ddd DD MMM YYYY h:mma');
        return (
            <div className="asset flex-row">
                <AssetPreview asset={asset} />
                {asset && (
                    <div>
                        <p>
                            <strong>{value}</strong>
                            <br />
                            Type: {asset.mime || 'unknown'} <br />
                            Filesize: {asset.size} <br />
                            Created: {created}
                        </p>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => this._toggleAssetManager()}>
                    Select asset
                </button>
                <Modal full={true} isVisible={selectingAsset}>
                    <h2>Select asset</h2>
                    <AssetManager
                        selectedAsset={asset}
                        onSelect={asset => this._selectAsset(asset)}
                    />
                    <button
                        type="button"
                        onClick={() => this._toggleAssetManager(false)}>
                        Done
                    </button>
                </Modal>
            </div>
        );
    }
}

export default Asset;
