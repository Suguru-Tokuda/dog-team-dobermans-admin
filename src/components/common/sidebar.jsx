
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class AdminSidebar extends Component {
    render() {
        return (
        <div className="sidebar">
            <nav className="scrollbar-container sidebar-nav ps ps-container ps--active-y">
                <ul className="nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/" exact>Home</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
        )
    }
}

export default AdminSidebar;