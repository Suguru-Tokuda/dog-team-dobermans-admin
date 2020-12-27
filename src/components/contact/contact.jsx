import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import ContactUsDetail from './contactDetail';
import ContactUsEditor from './contactEditor';
import ContactService from '../../services/contactService';
import toastr from 'toastr';

class Contact extends Component {
    state = {
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    updateContactUsInfo = () => {
        this.props.showLoading({ reset: true, count: 1 });
        ContactService.getContactusInfo()
            .then(res => {
                this.setState({ contactInfo: res.data });
            })
            .catch(err => {
            toastr.error('There was an error in loading contact us info');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    render() {
        const { url } = this.state;
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path={`${url}/`} exact render={(props) => <ContactUsDetail {...props}  />} />
                    <Route path={`${url}/editor`} render={(props) => <ContactUsEditor {...props}  />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact);