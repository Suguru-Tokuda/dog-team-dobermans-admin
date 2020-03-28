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
            <header className="c-header c-header-light c-header-fixed">
                <button className="c-header-toggler c-class-toggler d-lg-none mfe-auto" type="button" data-target="#sidebar" data-class="c-sidebar-show">
                    <i className="fas fa-bars"></i>
                </button>
                <button className="c-header-toggler c-class-toggler mfs-3 d-md-down-none" type="button" data-target="#sidebar" data-class="c-sidebar-lg-show" responsive="true">
                    <i className="fas fa-bars"></i>
                </button>
                <Link className="navbar-brand" to="/">
                    <img className="navbar-brand-full" src={siteLogo} width="89" height="25" style={{filter: 'invert(90%)'}} alt="Dog Team Dobermans Logo"></img>
                    {/* <img className="navbar-brand-minimized" src={siteLogo} width="30" height="30" style={{filter: 'invert(90%)'}} alt="Dog Team Dobermans Logo"></img> */}
                </Link>
                <ul className="ml-auto c-header-nav mr-5">
                    {authenticated === true && (
                        <li className="c-header-nav-item">
                            <a className="c-header-nav-link" href="/" onClick={this.handleSignoutClicked}>Sing out</a>
                        </li>
                    )}
                </ul>
            </header>
        );
    }
}

export default AdminHeader;