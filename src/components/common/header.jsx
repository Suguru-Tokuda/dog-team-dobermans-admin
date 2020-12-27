import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '../../services/firebaseService';

class AdminHeader extends Component {

    handleSignoutClicked = () => {
        this.props.showLoading({ reset: true, count: 1 });
        auth.signOut()
            .then(res => {
                this.props.logout();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
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
                <ul className="ml-auto c-header-nav mr-5">
                    {authenticated === true && (
                        <li className="c-header-nav-item">
                            <a className="c-header-nav-link" href="/" onClick={this.handleSignoutClicked}>Sign out</a>
                        </li>
                    )}
                </ul>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminHeader);