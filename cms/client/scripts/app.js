'use strict';

import React, { Component, Fragment } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import { Loader, Notify, Req } from './util';
import { ContentView, UsersView, AssetsView } from './views';
import { Sidebar } from './components';
import { store } from './modules';

// Move this out to app.js
document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        store.set('isLoading', true);
        let link = e.target.getAttribute('href');
        Req(link)
            .then(res => {
                if (res.status === 200) {
                    Notify.message(e.target.innerText + ' complete');
                } else {
                    Notify.alert(e.target.innerText + ' failed');
                }
            })
            .catch(() => {
                Notify.alert('Something went wrong... sorry :(');
            })
            .finally(() => {
                store.set('isLoading', false);
            });
    });
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: props.store.get('isLoading'),
            schemas: null,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            isLoading: newProps.store.get('isLoading'),
        });
    }

    componentDidMount() {
        Req(`/admin/data/schema`)
            .then(res => res.json())
            .then(res => {
                this.setState({ schemas: res.schemas });
            })
            .catch(err => {
                Notify.alert(err);
            })
            .finally(() => {
                store.set('isLoading', false);
            });
        // window.addEventListener('hashchange', () => {
        //     this._setRoute();
        // });
        // this._setRoute();
    }

    _setRouter(router) {
        this.router = router;
    }

    render() {
        const { isLoading, schemas } = this.state;
        const route = this.router && this.router.state;
        return (
            <Fragment>
                <Loader show={isLoading} />
                <Router ref={ref => this._setRouter(ref)} path="/">
                    <Fragment>
                        <Sidebar schemas={schemas} route={route} />
                        <div id="app">
                            <Route
                                path="/admin/content/:resource"
                                component={ContentView}
                            />
                            <Route
                                path="/admin/manage/assets"
                                component={AssetsView}
                            />
                            <Route
                                path="/admin/manage/users"
                                component={UsersView}
                            />
                        </div>
                    </Fragment>
                </Router>
                <Notify.component messages={store.messages} />
            </Fragment>
        );
    }
}

const appContainer = document.getElementById('root');

store.update = () => {
    render(<App store={store} />, appContainer);
};

store.update();
