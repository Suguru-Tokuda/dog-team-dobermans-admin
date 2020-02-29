
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class AdminSidebar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
        <div className="sidebar">
            <nav className="scrollbar-container sidebar-nav ps ps-container ps--active-y">
                <ul className="nav">
                    {authenticated === false && (
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to="/login" exact>Login</NavLink>
                        </li>
                    )}
                    {authenticated === true && (
                        <React.Fragment>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/" exact>Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/puppies">Puppies</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/parents">Parents</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/buyers">Buyers</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/testimonials">Testimonials</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/wait-list">Wait List</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/about-dobermans">About Dobermans</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/about-us">About Us</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/blog">Blogs</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/contact">Contact</NavLink>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </nav>
        </div>
        );
    }
}

export default AdminSidebar;