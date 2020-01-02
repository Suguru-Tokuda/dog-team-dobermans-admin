import React, { Component } from 'react';
import { auth } from '../../services/firebaseService';
import toastr from 'toastr';

class Login extends Component {
    state = {
        email: '',
        password: '',
        formSubmitted: false
    }

    handleSetEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    handleSetPassword = (e) => {
        this.setState({ password: e.target.value });
    }

    handleLoginBtnClicked = () => {
        this.setState({ formSubmitted: true });
        const { email, password } = this.state;
        if (email !== '' && password !== '') {
            this.props.onShowLoading(true, 1);
            auth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    this.props.onLogin(true);
                    this.props.history.push('/');
                })
                .catch(err => {
                    console.log(err);
                    toastr.error(`Email and password don't match. Try again.`);
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    handleSubmitByEnter = (e) => {
        if (e.key === 'Enter')
            this.handleLoginBtnClicked();
    }

    render() {
        const { email, password, formSubmitted } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card-group">
                            <div className="card p-4">
                                <div className="card-body">
                                    <h1>Login</h1>
                                    <p className="text-muted">Sign In to your account</p>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="fa fa-user"></i>
                                            </span>
                                        </div>
                                        <input className="form-control" type="text" placeholder="Email" vlaue={email} onChange={this.handleSetEmail} onKeyUp={this.handleSubmitByEnter} />
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
                                            <button className="btn btn-primary px-4" type="button" onClick={this.handleLoginBtnClicked}>Login</button>
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

export default Login;