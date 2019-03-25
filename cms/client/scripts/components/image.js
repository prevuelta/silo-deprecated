import React, { Component, Fragment } from 'react';
import DropZone from 'react-dropzone';
import Modal from './modal';
import { MiniLoader } from '../util/loader';
import Req from '../util/request';
import Notify from '../util/notify';
import Icon from './icons';

const [, , , siloName, node] = location.pathname.split('/');

const File = props => {
    let { f, isSelected, deleteFile, selectFile } = props;
    return (
        <div className={isSelected ? 'file-display selected' : 'file-display'}>
            <div className="image">
                <img
                    onClick={selectFile}
                    src={`/images/thumbs/${f.filename}`}
                />
            </div>
            <button type="button" className="delete-file" onClick={deleteFile}>
                <Icon.X />
            </button>
            <p title={f.originalname} className="file-title">
                {f.originalname}
                {f.width &&
                    f.height && (
                        <Fragment>
                            <br />
                            <span>
                                {f.width}x{f.height}
                            </span>
                        </Fragment>
                    )}
            </p>
            {!isSelected && (
                <button type="button" className="small" onClick={selectFile}>
                    Select
                </button>
            )}
        </div>
    );
};

class ImageField extends Component {
    constructor(props) {
        super(props);
        console.log('Image', props);
        this.state = {
            files: null,
            searchFiles: null,
            data: props.formData || {},
            modalIsVisible: false,
            searchStr: '',
            isUploading: false,
        };
    }

    onChange(name) {
        return event => {
            this.setState(
                {
                    data: {
                        ...this.state.data,
                        [name]: event.target.value,
                    },
                },
                () => this.props.onChange(this.state.data)
            );
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ data: newProps.formData });
    }

    selectFile(f) {
        this.setState(
            {
                data: { ...this.state.data, src: f.filename },
            },
            () => this.props.onChange(this.state.data)
        );
    }

    deleteFile(f) {
        let confirm = window.confirm(
            'Are you sure you want to delete this file?'
        );
        if (confirm) {
            Req(`${clientSettings.filesEndpoint}/${siloName}`, 'DELETE', {
                fileId: f._id,
            })
                .then(res => {
                    if (res.status === 200) {
                        this.getFiles();
                        Notify.message('File deleted');
                    } else {
                        Notify.alert('Problem deleting file');
                    }
                })
                .catch(error => {
                    console.error(error);
                    Notify.alert('Problem deleting file');
                });
        }
    }

    hideModal() {
        this.setState({ modalIsVisible: false });
    }

    getFiles() {
        return Req(`${clientSettings.filesEndpoint}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({ files: res });
            })
            .catch(err => {
                Notify.alert(err);
            });
    }

    showModal() {
        this.getFiles().then(() => {
            this.setState({ modalIsVisible: true });
        });
    }

    remove(name) {
        this.setState(
            {
                data: {},
            },
            () => this.props.onChange(this.state)
        );
    }

    onDrop(files) {
        if (!this.state.isUploading) {
            this.setState({ isUploading: true }, () => {
                files.forEach(f => {
                    Req(
                        `${clientSettings.filesEndpoint}/${siloName}`,
                        'POST',
                        f,
                        'formData'
                    )
                        .then(res => {
                            if (res.status === 200) {
                                this.getFiles();
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

    search(str) {
        const regEx = new RegExp(str);
        const searchFiles = this.state.files.filter(f =>
            regEx.test(f.originalname)
        );
        this.setState({ searchStr: str, searchFiles });
    }

    clearSearch() {
        this.setState({ searchStr: '', searchFiles: [] });
    }

    render() {
        const { src, alt, title, caption, credit } = this.state.data;
        const { searchStr, isUploading } = this.state;
        const files = searchStr ? this.state.searchFiles : this.state.files;
        const noResult = searchStr
            ? `No results for '${searchStr}'`
            : 'No files';
        return (
            <div className="field-image">
                <div className="preview">
                    <div className="image">
                        {src ? (
                            <img
                                src={`${
                                    clientSettings.fileEndpoint
                                }/thumbs/${src}`}
                                alt=""
                                height="100"
                                title=""
                            />
                        ) : (
                            <p>No image selected</p>
                        )}
                    </div>
                    <input
                        data-type="image"
                        type="text"
                        value={src || ''}
                        readOnly
                    />
                    <div className="button-group">
                        <button
                            type="button"
                            onClick={this.showModal.bind(this)}>
                            Select image
                        </button>
                        <button type="button" onClick={() => this.remove()}>
                            Remove
                        </button>
                    </div>
                </div>
                <div className="info">
                    <div className="form-group">
                        <label>Alternative text</label>
                        <input
                            className="form-control"
                            type="text"
                            value={alt || ''}
                            onChange={this.onChange('alt')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            className="form-control"
                            type="text"
                            value={title || ''}
                            onChange={this.onChange('title')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Caption</label>
                        <textarea
                            className="form-control"
                            type="text"
                            value={caption || ''}
                            onChange={this.onChange('caption')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Credit</label>
                        <textarea
                            className="form-control"
                            type="text"
                            value={credit || ''}
                            onChange={this.onChange('credit')}
                        />
                    </div>
                </div>
                <Modal
                    close={!isUploading && this.hideModal.bind(this)}
                    full={true}
                    isVisible={this.state.modalIsVisible}>
                    <h2>Select Image</h2>
                    <div className="image-actions">
                        <label>
                            <input
                                type="text"
                                placeholder="Search for..."
                                value={this.state.searchStr}
                                onChange={e => this.search(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => this.clearSearch()}>
                                Clear
                            </button>
                        </label>
                    </div>
                    {!files && <MiniLoader />}
                    {!!files && (
                        <div className="asset-table">
                            {!files.length && <p>{noResult}</p>}
                            {files.map((f, i) => {
                                return (
                                    <Asset
                                        f={f}
                                        selectFile={() => this.selectFile(f)}
                                        isSelected={src === f.filename}
                                        key={f._id}
                                        deleteFile={() => this.deleteFile(f)}
                                    />
                                );
                            })}
                        </div>
                    )}
                    <DropZone
                        onDrop={this.onDrop.bind(this)}
                        className="drop-zone">
                        {isUploading ? (
                            <MiniLoader />
                        ) : (
                            <p>Upload new image/s</p>
                        )}
                    </DropZone>
                    {!isUploading && (
                        <button onClick={this.hideModal.bind(this)}>
                            Done
                        </button>
                    )}
                </Modal>
            </div>
        );
    }
}

export default ImageField;
