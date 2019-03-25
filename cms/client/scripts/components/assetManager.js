'use strict';

import Asset from './assetManagerAsset';
import Notify from '../util/notify';
import React, { Component } from 'react';
import Req from '../util/request';
import { MiniLoader } from '../util/loader';
import DropZone from 'react-dropzone';

const { Fragment } = React;

class AssetManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            assets: null,
            selectedAsset: props.selectedAsset || null,
            searchStr: '',
            searchAssets: [],
            sortBy: 'name',
        };
    }

    componentDidMount() {
        this._getAssets();
    }

    componentWillReceiveProps(newProps) {
        this.setState({ selectedAsset: newProps.selectedAsset });
    }

    _getAssets() {
        return Req('/admin/data/asset')
            .then(res => res.json())
            .then(assets => {
                this._sortAssets(assets);
            })
            .catch(err => {
                Notify.alert(err);
            });
    }

    _selectAsset(selectedAsset) {
        this.setState({ selectedAsset });
        this.props.onSelect && this.props.onSelect(selectedAsset);
    }

    _deleteAsset(asset) {
        let confirm = window.confirm(
            'Are you sure you want to delete this file?'
        );
        if (confirm) {
            Req('/admin/data/asset', 'DELETE', { asset: asset.name }).then(
                res => {
                    if (res.status === 200) {
                        this._getAssets();
                        Notify.message('Asset deleted');
                    } else {
                        Notify.alert('Problem deleting asset');
                    }
                }
            );
        }
    }

    _sortAssets(assets) {
        const { sortBy } = this.state;
        assets = assets || this.state.assets;

        const sortedAssets = assets.sort((a, b) => {
            return a[sortBy] > b[sortBy] ? 1 : a[sortBy] < b[sortBy] ? -1 : 0;
        });

        this.setState({ assets: sortedAssets });
    }

    _search(str) {
        const regEx = new RegExp(str);
        const searchAssets = this.state.assets.filter(f => regEx.test(f.name));
        this.setState({ searchStr: str, searchAssets });
    }

    _clearSearch() {
        this.setState({ searchStr: null, searchAssets: [] });
    }

    _onDrop(files) {
        if (!this.state.isUploading) {
            this.setState({ isUploading: true }, () => {
                files.forEach(f => {
                    Req('/admin/data/asset', 'POST', f, 'formData')
                        .then(res => {
                            if (res.status === 200) {
                                this._getAssets();
                                Notify.message('File uploaded');
                            } else {
                                Notify.alert('Problem uploading file');
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            Notify.alert(error);
                        })
                        .finally(() => {
                            this.setState({ isUploading: false });
                        });
                });
            });
        }
    }

    _updateSort(e) {
        this.setState({ sortBy: e.target.value }, this._sortAssets);
    }

    render() {
        const {
            isUploading,
            assets,
            selectedAsset,
            searchAssets,
            searchStr,
            sortBy,
        } = this.state;
        const assetsResult = searchStr ? searchAssets : assets;
        const noResult = searchStr
            ? `No results for '${searchStr}'`
            : 'No files';
        return (
            <Fragment>
                <div className="asset-actions">
                    <label>
                        <input
                            type="text"
                            placeholder="Search for..."
                            value={this.state.searchStr}
                            onChange={e => this._search(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => this._clearSearch()}>
                            Clear
                        </button>
                    </label>
                    <label>Sort by:</label>
                    <label htmlFor="sort-name">
                        <input
                            id="sort-name"
                            type="radio"
                            name="sort-group"
                            value="name"
                            checked={sortBy === 'name'}
                            onChange={e => this._updateSort(e)}
                        />
                        Name
                    </label>
                    <label htmlFor="sort-created">
                        <input
                            id="sort-created"
                            type="radio"
                            name="sort-group"
                            value="created"
                            checked={sortBy === 'created'}
                            onChange={e => this._updateSort(e)}
                        />
                        Date
                    </label>
                </div>
                {assetsResult ? (
                    <div className="asset-table">
                        {!assetsResult.length && <p>{noResult}</p>}
                        {assetsResult.map((asset, i) => (
                            <Asset
                                key={i}
                                asset={asset}
                                selected={
                                    selectedAsset &&
                                    selectedAsset.name === asset.name
                                }
                                selectAsset={() => this._selectAsset(asset)}
                                deleteAsset={() => this._deleteAsset(asset)}
                            />
                        ))}
                    </div>
                ) : (
                    <MiniLoader />
                )}
                <DropZone
                    onDrop={files => this._onDrop(files)}
                    className="drop-zone">
                    {isUploading ? <MiniLoader /> : <p>Upload file/s</p>}
                </DropZone>
            </Fragment>
        );
    }
}

export default AssetManager;
// isSelected={src === f.filename}
// key={f._id}
// deleteFile={() => this.deleteFile(f)}
// {!isUploading && (
//     <button onClick={() => this._hide()}>Done</button>
// )}
