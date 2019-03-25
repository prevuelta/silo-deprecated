import React from 'react';
import Moment from 'moment';
import Loader from '../util/loader';
import Req from '../util/request';
import Notify from '../util/notify';
import Modal from './modal';
import Icon from './icons';
import TokenGenerator from './token';

function ConsumerRow(props) {
    let { data, keys } = props;
    return (
        <tr>
            {keys.map(k => (
                <td key={k} align="center">
                    {data[k].toString()}
                </td>
            ))}
            <td>
                <div className="tools">
                    <TokenGenerator consumer={data._id} />
                    <button
                        className="btn-delete orange"
                        onClick={props.deleteConsumer.bind(
                            null,
                            data._id,
                            data.name
                        )}>
                        <Icon.X />
                    </button>
                </div>
            </td>
        </tr>
    );
}

class ConsumerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            resource: '',
        };
    }

    _submitConsumer(e) {
        const { name, resource } = this.state;
        let payload = {
            name,
            resource,
        };
        console.log(payload);
        this.props.submitConsumer(payload);
    }

    _setState(k, v) {
        this.setState({ [k]: v });
    }

    render() {
        const { resource } = this.state;
        return (
            <div>
                <h2>Add Consumer</h2>
                <div className="form-group">
                    <input
                        onChange={e => this._setState('name', e.target.value)}
                        type="text"
                        placeholder="Name"
                        name="name"
                    />
                </div>
                <div className="form-group">
                    <select
                        value={resource}
                        onChange={e =>
                            this._setState('resource', e.target.value)
                        }>
                        {this.props.resources.map((r, i) => (
                            <option value={r} key={i}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={e => this._submitConsumer()}>Submit</button>
            </div>
        );
    }
}

class Consumers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsVisible: false,
        };
    }

    _submitConsumer(payload) {
        this._hideModal();
        Loader.show();
        console.log(payload);
        Req(`admin/manage/consumer`, 'POST', payload)
            .then(res => {
                Loader.hide();
                this.props.refresh();
            })
            .catch(err => {
                Loader.hide();
            });
    }

    _deleteConsumer(id, name) {
        let confirm = window.confirm(
            `Are you sure you want to delete '${name}'?`
        );
        if (confirm) {
            Loader.show();
            Req(`admin/manage/consumer`, 'DELETE', { id })
                .then(res => {
                    Loader.hide();
                    Notify.message('Consumer deleted');
                    this.props.refresh();
                })
                .catch(err => {
                    Loader.hide();
                    Notify.alert(err);
                });
        }
    }

    _showModal() {
        this.setState({ modalIsVisible: true });
    }

    _hideModal() {
        this.setState({ modalIsVisible: false });
    }

    render() {
        let { consumers } = this.props;
        let keys = ['name', 'created', 'resource'];

        return (
            <div className="block">
                <h2>API Consumers</h2>
                <Modal
                    isVisible={this.state.modalIsVisible}
                    close={this._hideModal.bind(this)}>
                    <ConsumerForm
                        resources={this.props.resources}
                        submitConsumer={this._submitConsumer.bind(this)}
                    />
                </Modal>
                <table>
                    <thead>
                        <tr>
                            {keys.map(k => <th key={k}>{k}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consumers &&
                            consumers.map((u, i) => {
                                let consumer = {
                                    ...u,
                                    created: Moment(u.created).format(
                                        'MM ddd, YYYY'
                                    ),
                                };
                                return (
                                    <ConsumerRow
                                        key={i}
                                        keys={keys}
                                        data={consumer}
                                        deleteConsumer={this._deleteConsumer.bind(
                                            this
                                        )}
                                    />
                                );
                            })}
                        {!consumers.length && (
                            <tr>
                                <td colSpan={keys.length} align="center">
                                    No consumers
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button onClick={this._showModal.bind(this)}>
                    Add consumer
                </button>
            </div>
        );
    }
}

export default Consumers;
