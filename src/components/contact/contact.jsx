import React, { Component } from 'react';
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
        this.props.onShowLoading(true, 1);
        ContactService.getContactusInfo()
            .then(res => {
                this.setState({ contactInfo: res.data });
            })
            .catch(err => {
            toastr.error('There was an error in loading contact us info');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { url } = this.state;
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path={`${url}/`} exact render={(props) => <ContactUsDetail {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path={`${url}/editor`} render={(props) => <ContactUsEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default Contact;