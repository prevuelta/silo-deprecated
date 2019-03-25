'use strict';

import React, { Component } from 'react';
import Moment from 'moment';
import Loader from '../util/loader';
import Req from '../util/request';
import Notify from '../util/notify';
import Modal from './modal';
import Icon from './icons';
import { store } from '../modules';

import TokenGenerator from './token';

const { Fragment } = React;

function UserRow(props) {
    const { user, keys } = props;
    return (
        <tbody>
            <tr>
                {keys.map(k => <td key={k}>{user[k]}</td>)}
                <td>
                    <div className="tools">
                        <TokenGenerator user={user.id} />
                        <button
                            className="icon text"
                            onClick={() => props.editUser(user)}>
                            Edit
                        </button>
                        <button
                            className="btn-delete orange"
                            onClick={() =>
                                props.deleteUser(props.id, user.username)
                            }>
                            <Icon.X />
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}
function RoleSelect(props) {
    const { role } = props;
    return (
        <div>
            <label>Role</label>
            <select
                value={props.role}
                id={role}
                onChange={e => props.onChange(e.target.value)}>
                <option value="">Select a role</option>
                <option value="1">Read</option>
                <option value="2">ReadWrite</option>
                <option value="3">Admin</option>
            </select>
        </div>
    );
}

class UserForm extends React.Component {
    constructor(props) {
        super(props);
        const { user } = props;
        this.state = {
            username: user && user.username,
            email: user && user.email,
            admin: user && user.admin,
            role: user && user.role,
        };
    }

    _setState(k, v) {
        this.setState({ [k]: v });
    }

    _submitUser(e) {
        const { username, email, role, admin, password } = this.state;
        const payload = {
            username,
            email,
            role,
            admin: !!admin,
        };
        if (this.props.user) {
            payload.id = this.props.user.id;
        } else {
            payload.password = password;
        }
        this.props.submitUser(payload);
    }

    render() {
        const add = !this.props.user;
        const { username, email, admin, role } = this.state;
        return (
            <div>
                <h2>{add ? 'Add' : 'Edit'} user</h2>
                <div className="form-group">
                    <label htmlFor="name">Username</label>
                    <input
                        onChange={e =>
                            this._setState('username', e.target.value)
                        }
                        type="text"
                        placeholder="Username"
                        autocomplete="false"
                        id="username"
                        defaultValue={username}
                    />
                </div>
                {add && (
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={e =>
                                this._setState('password', e.target.value)
                            }
                            autocomplete="false"
                            type="password"
                            placeholder="Password"
                            id="password"
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={e => this._setState('email', e.target.value)}
                        type="email"
                        autoComplete="email"
                        placeholder="Email"
                        id="email"
                        defaultValue={email}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="admin">
                        <input
                            onChange={e =>
                                this._setState('admin', e.target.checked)
                            }
                            type="checkbox"
                            id="admin"
                        />
                        <span>is Admin</span>
                    </label>
                </div>
                <div className="form-group">
                    <h3>Permissions</h3>
                    <RoleSelect
                        role={role}
                        onChange={value => this._setState('role', value)}
                    />
                </div>

                <button onClick={e => this._submitUser(e)}>
                    {add ? 'Create user' : 'Save user'}
                </button>
            </div>
        );
    }
}

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsVisible: false,
            user: {},
        };
    }

    _submitUser(payload) {
        this._hideModal();
        console.log('User', payload);
        store.set('isLoading', true);
        Req('/admin/data/user', 'POST', payload)
            .then(res => {
                if (res.status !== 200) {
                    Notify.alert('Error creating user');
                }
                store.set('isLoading', false);
                this.props.refresh();
            })
            .catch(err => {
                // TODO: more error messages that actually describe what happened
                console.log(err);
                store.set('isLoading', false);
                Notify.alert('Error creating user');
            });
    }

    _deleteUser(id, name) {
        const confirm = window.confirm(
            `Are you sure you want to delete '${name}'?`
        );
        if (confirm) {
            store.set('isLoading', true);
            Req('/admin/data/user', 'DELETE', { id })
                .then(res => {
                    store.set('isLoading', false);
                    Notify.message('User deleted');
                    this.props.refresh();
                })
                .catch(err => {
                    store.set('isLoading', false);
                    Notify.alert(err);
                });
        }
    }

    _editUser(user) {
        this.setState({ user }, () => {
            this._showModal();
        });
    }

    _addUser() {
        this.setState({ user: null }, () => {
            this._showModal();
        });
    }

    _showModal() {
        this.setState({ modalIsVisible: true });
    }

    _hideModal() {
        this.setState({ modalIsVisible: false });
    }

    render() {
        const { users } = this.props;
        const { user } = this.state;
        const keys = ['username', 'email', 'created', 'admin', 'role'];

        return (
            <div className="block">
                <Modal
                    isVisible={this.state.modalIsVisible}
                    close={this._hideModal.bind(this)}>
                    <UserForm
                        submitUser={this._submitUser.bind(this)}
                        user={user}
                    />
                </Modal>
                <table>
                    <thead>
                        <tr>
                            {keys.map(k => <th key={k}>{k}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {users &&
                        users.map((u, i) => {
                            const user = {
                                ...u,
                                created: Moment(+u.created).format(
                                    'ddd DD MMM, YYYY h:mma'
                                ),
                            };
                            return (
                                <UserRow
                                    key={i}
                                    keys={keys}
                                    id={user.id}
                                    user={user}
                                    deleteUser={(id, name) =>
                                        this._deleteUser(id, name)
                                    }
                                    editUser={data => this._editUser(data)}
                                />
                            );
                        })}
                </table>
                <button onClick={() => this._addUser()}>Add user</button>
            </div>
        );
    }
}

export default Users;
