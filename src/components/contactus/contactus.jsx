import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ContactUsDetail from './contactUsDetail';
import ContactUsEditor from './contactUsEditor';
import ContactusService from '../../services/contactUsService';
import toastr from 'toastr';

class ContactUs extends Component {
    state = {
        contactUsInfo: {},
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        ContactusService.getContactusInfo()
            .then(res => {
                const contactUsInfo = res.data;
                if (Object.keys(contactUsInfo).length === 0) {
                    this.props.history.push('/contact-us/editor');
                } else {
                    this.setState({ contactUsInfo });
                    this.props.history.push('/contact-us/view');
                }
            })
            .catch(err => {
               toastr.error('There was an error in loading contact us info');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    updateContactUsInfo = () => {
        this.props.onShowLoading(true, 1);
        ContactusService.getContactusInfo()
            .then(res => {
                this.setState({ contactUsInfo: res.data });
            })
            .catch(err => {
            toastr.error('There was an error in loading contact us info');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { contactUsInfo, url } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}/editor`} render={(props) => <ContactUsEditor {...props} contactUsInfo={contactUsInfo} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} onUpdateContactUsInfo={this.updateContactUsInfo} />} />
                <Route path={`${url}/view`} render={(props) => <ContactUsDetail {...props} contactUsInfo={contactUsInfo} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default ContactUs;