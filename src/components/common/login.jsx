import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '../../services/firebaseService';
import { Checkbox } from 'react-ui-icheck';
import toastr from 'toastr';
import Cookies from 'js-cookie';
import * as siteLogo from '../../assets/img/site_logo.PNG';
import CryptoJS from 'crypto-js';
import * as key from '../../key.json';
import { Link } from 'react-router-dom';

class Login extends Component {
    state = {
        email: '',
        password: '',
        rememberMe: false,
        formSubmitted: false
    }

    constructor(props) {
        super(props);
        if (Cookies.get('rememberMe')) {
            this.state.rememberMe = Cookies.get('rememberMe') === 'true' ? true : false;
        }
        if (this.state.rememberMe === true) {
            try {
                if (Cookies.get('email') && Cookies.get('password')) {
                    this.state.email = Cookies.get('email');
                    const bytes = CryptoJS.AES.decrypt(Cookies.get('password'), key.PRIVATE_KEY);
                    this.state.password = bytes.toString(CryptoJS.enc.Utf8);
                } else {
                    Cookies.remove('rememberMe');
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    handleSetEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    handleSetPassword = (e) => {
        this.setState({ password: e.target.value });
    }

    handleLoginBtnClicked = async () => {
        this.setState({ formSubmitted: true });
        const { email, password, rememberMe } = this.state;

        if (email.toLowerCase() !== 'suguru.tokuda@gmail.com' && email.toLowerCase() !== 'omegarlj@yahoo.com') {
            toastr.error('You are not allowed to login to the system');
            return;
        }

        if (email !== '' && password !== '') {
            this.props.showLoading({ reset: true, count: 1 });
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    if (rememberMe === true) {
                        const encryptedPassword = CryptoJS.AES.encrypt(password, key.PRIVATE_KEY).toString();
                        Cookies.set('email', email);
                        Cookies.set('password', encryptedPassword);
                        Cookies.set('rememberMe', rememberMe);
                    } else {
                        Cookies.remove('email');
                        Cookies.remove('password');
                        Cookies.remove('rememberMe');
                    }

                    this.props.login();

                    if (this.props.location.state && this.props.location.state.prevURL)
                        this.props.history.push(this.props.location.state.prevURL);
                    else
                        this.props.history.push('/');
                })
                .catch(err => {
                    console.log(err);
                    toastr.error(`Email and password don't match. Try again.`);
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    handleSubmitByEnter = (e) => {
        if (e.key === 'Enter')
            this.handleLoginBtnClicked();
    }

    render() {
        const { email, password, formSubmitted } = this.state;
        let { rememberMe } = this.state;
        return (
            <div className="login-window">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card-group">
                                <div className="card p-4">
                                    <div className="card-body">
                                        <img src={siteLogo} alt={siteLogo} width="200" style={{filter: 'invert(90%)'}}></img>
                                        <p className="text-muted mt-3">Sign In to your account</p>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fa fa-envelope"></i>
                                                </span>
                                            </div>
                                            <input className="form-control" type="text" placeholder="Email" value={email} onChange={this.handleSetEmail} onKeyUp={this.handleSubmitByEnter} />
                                            {(formSubmitted === true && email === '') && (
                                                <React.Fragment>
                                                    <br />
                                                    <small className="text-danger">Enter email</small>
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <div className="input-group mb-4">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="fa fa-lock"></i>
                                                </span>
                                            </div>
                                            <input className="form-control" type="password" value={password} placeholder="Password" onChange={this.handleSetPassword} onKeyUp={this.handleSubmitByEnter} />
                                            {(formSubmitted === true && password === '') && (
                                                <React.Fragment>
                                                    <br />
                                                    <small className="text-danger">Enter password</small>
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="input-group mb-4">
                                                    <div className="input-group-prepend">
                                                        <Checkbox checkboxClass="icheckbox_square-blue" checked={rememberMe} onChange={() => this.setState({ rememberMe: !rememberMe})} label=" Remember Me" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="float-right">
                                                    <button className="btn btn-primary px-4" type="button" onClick={this.handleLoginBtnClicked}>Login</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="float-right">
                                                    <Link to="/password-reset">Forgot password?</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);