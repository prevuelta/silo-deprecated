'use strict';

import React from 'react';
import { MiniLoader } from '../util/loader';
import Icon from './icons';

const { Fragment } = React;

const AssetPreview = props => {
    const { isImage, name, ext } = props.asset || {};
    return props.asset ? (
        <div className="asset-preview">
            {isImage ? (
                <img src={`/image/thumb/${name}`} />
            ) : (
                <div className="asset-icon">{ext}</div>
            )}
            {props.children}
        </div>
    ) : (
        <p>
            <strong>?</strong>
        </p>
    );
};

const Asset = props => {
    const { asset, selected, deleteAsset, selectAsset } = props;
    const { mime, name, ext } = asset;
    const isImage = mime && mime.includes('image');
    return (
        <div className={`asset-item ${selected ? 'selected' : ''}`}>
            <AssetPreview asset={asset}>
                <div className="hover-preview">
                    <button
                        type="button"
                        className="delete-file"
                        onClick={deleteAsset}>
                        <Icon.X />
                    </button>
                    <img src={`/image/thumb/${name}`} />
                    <p>{name}</p>
                    <button
                        disabled={selected}
                        type="button"
                        className="small"
                        onClick={selectAsset}>
                        {selected ? 'Selected' : 'Select'}
                    </button>
                </div>
            </AssetPreview>
            <p title={name} className="file-title">
                {name}
            </p>
            <button
                disabled={selected}
                type="button"
                className="small"
                onClick={selectAsset}>
                {selected ? 'Selected' : 'Select'}
            </button>
        </div>
    );
};

export { AssetPreview };
export default Asset;
