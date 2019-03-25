'use strict';

import React from 'react';
import { alphaSort } from '../util';
import { NavLink, withRouter } from 'react-router-dom';

export default withRouter(props => {
    const { route, schemas } = props;
    return (
        <section id="sidebar">
            <header>
                <h3>Content</h3>
            </header>
            <nav>
                {(schemas || []).sort(alphaSort).map(c => {
                    const className = c === route ? 'active' : '';
                    return (
                        <NavLink
                            key={c}
                            className={className}
                            to={`/admin/content/${c}`}>
                            {c}
                        </NavLink>
                    );
                })}
            </nav>
            <header>
                <h3>Manage</h3>
            </header>
            <nav>
                <NavLink to="/admin/manage/assets">Assets</NavLink>
                {!!user.isAdmin && (
                    <NavLink to="/admin/manage/users">Users</NavLink>
                )}
            </nav>
        </section>
    );
});
