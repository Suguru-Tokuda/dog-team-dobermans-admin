import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../services/firebaseService';

class AdminHeader extends Component {

    handleSignoutClicked = () => {
        this.props.onShowLoading(true, 1);
        auth.signOut()
            .then(res => {
                this.props.onSignOut(false);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { authenticated } = this.props;
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
                        {authenticated === true && (
                            <NavLink className="nav-link" activeClassName="active" to="/" exact>Home</NavLink>
                        )}
                    </li>
                </ul>
                <ul className="ml-auto navbar-nav mr-5">
                    {authenticated === true && (
                        <li className="nav-item">
                            <button className="nav-link" onClick={this.handleSignoutClicked}>Sign out</button>
                        </li>
                    )}
                </ul>
            </header>
        );
    }
}

export default AdminHeader;