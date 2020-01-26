import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebaseService';
import * as siteLogo from '../../assets/img/site_logo.PNG';

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
                <Link className="navbar-brand" to="/">
                    <img className="navbar-brand-full" src={siteLogo} width="89" height="25" style={{filter: 'invert(90%)'}} alt="Dog Team Dobermans Logo"></img>
                    <img className="navbar-brand-minimized" src={siteLogo} width="30" height="30" style={{filter: 'invert(90%)'}} alt="Dog Team Dobermans Logo"></img>
                </Link>
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