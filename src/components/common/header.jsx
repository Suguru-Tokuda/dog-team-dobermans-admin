import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class AdminHeader extends Component {
    render() {
        return(
            <header className="app-header navbar">
                <button className="navbar-toggler sidebar-toggler d-lg-none" type="button" data-toggle="sidebar-show">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <button className="navbar-toggler sidebar-toggler d-md-down-none" type="button" data-toggle="sidebar-lg-show">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="nav navbar-nav" style={{textAlign: 'left'}}>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/" exact>Home</NavLink>
                    </li>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/puppies">Puppies</NavLink>
                    </li>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/parents">Parents</NavLink>
                    </li>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/buyers">Buyers</NavLink>
                    </li>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/testimonials">Testimonials</NavLink>
                    </li>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/about-us">About Us</NavLink>
                    </li>
                    <li className="nav-item px-3">
                        <NavLink className="nav-link" activeClassName="active" to="/contact-us">Contact Us</NavLink>
                    </li>
                </ul>
                <ul className="ml-auto navbar-nav mr-5"></ul>
            </header>
        );
    }
}

export default AdminHeader;