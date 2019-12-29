import React, { Component } from 'react';
import { auth } from '../../services/firebaseService';

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
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
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
                                        <input className="form-control" type="text" placeholder="Email" vlaue={email} onChange={this.handleSetEmail} />
                                        {(formSubmitted === true && email === '') && (
                                            <small className="text-danger">Enter email</small>
                                        )}
                                    </div>
                                    <div className="input-group mb-4">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="fa fa-lock"></i>
                                            </span>
                                        </div>
                                        <input className="form-control" type="password" value={password} placeholder="Password" onChange={this.handleSetPassword} />
                                        {(formSubmitted === true && password === '') && (
                                            <small className="text-danger">Enter password</small>
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