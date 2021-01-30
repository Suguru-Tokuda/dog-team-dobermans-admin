import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import * as siteLogo from '../../assets/img/site_logo.PNG';

class AdminSidebar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
        <div className="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
            <div className="c-sidebar-brand d-lg-down-none">
                <Link to="/"><img className="c-sidebar-brand-full" src={siteLogo} width="89" height="25" style={{filter: 'invert(90%)'}} alt="Dog Team Dobermans Logo"></img></Link>
                <Link to="/"><img className="c-sidebar-brand-minimized" src={siteLogo} width="89" height="25" style={{filter: 'invert(90%)'}} alt="Dog Team Dobermans Logo"></img></Link>
            </div>
            <ul className="c-sidebar-nav">
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
                            <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/customers">Customers</NavLink>
                        </li>
                        <li className="c-sidebar-nav-item">
                            <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/testimonials">Testimonials</NavLink>
                        </li>
                        <li className="c-sidebar-nav-item">
                            <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/wait-list">Wait List</NavLink>
                        </li>
                        <li className="c-sidebar-nav-item">
                            <NavLink className="c-sidebar-nav-link" activeClassName="c-active" to="/messages">Messages</NavLink>
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
        </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});  

export default connect(mapStateToProps)(AdminSidebar);