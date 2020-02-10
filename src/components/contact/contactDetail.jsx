import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ContactService from '../../services/contactService';
import UtilService from '../../services/utilService';
import toastr from 'toastr';

class ContactUsDetail extends Component {
    state = {
        contactInfo: {}
    };

    componentDidMount() {
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
        const { contactInfo } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3>Cotnact Info</h3>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th>First Name</th>
                                    <td>{contactInfo.firstName}</td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>{contactInfo.lastName}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{contactInfo.email}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>{UtilService.formatPhoneNumber(contactInfo.phone)}</td>
                                </tr>
                                <tr>
                                    <th>Street</th>
                                    <td>{contactInfo.street}</td>
                                </tr>
                                <tr>
                                    <th>City</th>
                                    <td>{contactInfo.city}</td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td>{contactInfo.state}</td>
                                </tr>
                                <tr>
                                    <th>Zip</th>
                                    <td>{contactInfo.zip}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Link className="btn btn-primary" to="/contact/editor">Update</Link>
                </div>
            </div>
        )
    }
}

export default ContactUsDetail;