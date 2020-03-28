
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class AdminSidebar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
        <div className="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
            <nav className="scrollbar-container sidebar-nav ps ps-container ps--active-y">
                <ul className="c-sidebar-nav ps ps--active-y">
                    {authenticated === false && (
                        <li className="c-sidebar-nav-item">
                            <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/login" exact>Login</NavLink>
                        </li>
                    )}
                    {authenticated === true && (
                        <React.Fragment>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/" exact>Home</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/puppies">Puppies</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/parents">Parents</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/buyers">Buyers</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/testimonials">Testimonials</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/wait-list">Wait List</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/about-dobermans">About Dobermans</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/about-us">About Us</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/blog">Blogs</NavLink>
                            </li>
                            <li className="c-sidebar-nav-item">
                                <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/contact">Contact</NavLink>
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