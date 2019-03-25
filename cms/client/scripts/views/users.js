'use strict';

import React, { Component } from 'react';
import Promise from 'bluebird';
import { Req, Loader, Notify } from '../util';

import UserList from '../components/users';
// import TokenGenerator from '../components/token';
//

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            users: [],
        };
    }

    componentDidMount() {
        this._getUsers();
    }

    _getUsers() {
        Req(`/admin/data/user`)
            .then(res => res.json())
            .then(users => {
                // renderMain(res);
                this.setState({ users, isLoading: false });
            })
            .catch(err => {
                this.setState({ isLoading: false });
                Notify.alert(err);
            });
    }

    render() {
        const { isLoading, users } = this.state;
        return (
            <section>
                <header>
                    <h2>Users</h2>
                </header>
                <div className="blocks">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <UserList
                            users={users}
                            refresh={() => this._getUsers()}
                        />
                    )}
                </div>
            </section>
        );
    }
}
// <UserList
//     users={props.data.users}
//     refresh={getUsers}
//     resources={props.data.resources}
// />

// let data = {
//     users: [],
//     consumers: [],
//     resources: [],
// };

// const adminEndpoint = '/admin/manage';

// function App(props) {
//     return (
//         <div className="blocks">
//             <UserList
//                 users={props.data.users}
//                 refresh={getUsers}
//                 resources={props.data.resources}
//             />
//             <ConsumerList
//                 consumers={props.data.consumers}
//                 refresh={getConsumers}
//                 resources={props.data.resources}
//             />
//         </div>
//     );
// }

// function renderApp(data) {
//     ReactDOM.render(<App data={data} />, document.getElementById('admin-app'));
// }

// getUsers();
// getConsumers();

// function getUsers() {
//     Loader.show();
//     Req(`${adminEndpoint}/user`)
//         .then(res => res.json())
//         .then(res => {
//             // renderMain(res);
//             Loader.hide();
//             data.users = res;
//             renderApp(data);
//         })
//         .catch(err => {
//             Loader.hide();
//             Notify.alert(err);
//         });
// }

// function getConsumers() {
//     Loader.show();
//     Req(`${adminEndpoint}/consumer`)
//         .then(res => res.json())
//         .then(res => {
//             // renderMain(res);
//             Loader.hide();
//             data.consumers = res;
//             renderApp(data);
//         })
//         .catch(err => {
//             Loader.hide();
//             Notify.alert(err);
//         });
// }
