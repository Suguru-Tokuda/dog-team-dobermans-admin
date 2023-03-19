import React, { Component } from "react";
import { connect } from 'react-redux';
import { auth } from '../../services/firebaseService';
import { Link } from 'react-router-dom';
import * as siteLogo from '../../assets/img/site_logo.PNG';
import toastr from 'toastr';

class PasswordForgot extends Component {
 state = {
    email: '',
    submitted: false
 };

 handleRestBtnClicked = () => {
    this.setState({ submitted: true });

    if (this.state.email) {
        this.props.showLoading({ reset: true, count: 1});
        auth.sendPasswordResetEmail(this.state.email)
            .then(() => {
                this.setState({
                    submitted: false,
                    email: ''
                });
                toastr.success('Password reset email has been sent if an account exists. Check your email');
            })
            .catch(err => {
                toastr.error('There was an error in resetting the password. Try again.');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }
 }

 handleSubmitByEnter = (e) => {
    if (e.key === 'Enter')
        this.handleRestBtnClicked();
 }

 render() { 
    const { email, submitted } = this.state;

    return (
        <div className="login-window">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card p-4">
                            <div className="card-body">
                                <img src={siteLogo} 
                                     alt={siteLogo} 
                                     width="200" 
                                     style={{ filter: 'invert(90%)' }}
                                ></img>
                                <p className="text-muted mt-3">Enter your email to reset password.</p>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">
                                            <i className="fa fa-envelope"></i>
                                        </div>
                                    </div>
                                    <input className="form-control"
                                           type="email"
                                           placeholder="Email"
                                           value={email}
                                           onChange={(e) => this.setState({ email: e.target.value })}
                                           onKeyUp={this.handleSubmitByEnter}
                                    />
                                </div>
                                {(submitted && !email) && (
                                    <React.Fragment>
                                        <small className="text-danger">
                                            Enter email
                                        </small>
                                    </React.Fragment>
                                )}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="float-right">
                                            <button className="btn btn-primary px-4"
                                                    type="button"
                                                    onClick={this.handleRestBtnClicked}
                                            >
                                                Reset Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="float-right">
                                            <Link to="/login">Back to Login</Link>
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

const mapDispatchToProps = dispatch => {
    return {
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(null, mapDispatchToProps)(PasswordForgot);