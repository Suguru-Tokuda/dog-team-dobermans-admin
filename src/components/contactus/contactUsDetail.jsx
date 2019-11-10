import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ContactUsDetail extends Component {
    state = {
        contactUsInfo: {}
    };

    constructor(props) {
        super(props);
        this.state.contactUsInfo = props.contactUsInfo;
    }

    componentDidUpdate(props) {
        if (JSON.stringify(this.state.contactUsInfo) !== JSON.stringify(props.contactUsInfo)) {
            this.setState({ contactUsInfo: props.contactUsInfo });
        }
    }

    render() {
        const { contactUsInfo } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3>Cotnact Us Info</h3>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th>First Name</th>
                                    <td>{contactUsInfo.firstName}</td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>{contactUsInfo.lastName}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{contactUsInfo.email}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>{contactUsInfo.phone}</td>
                                </tr>
                                <tr>
                                    <th>Street</th>
                                    <td>{contactUsInfo.street}</td>
                                </tr>
                                <tr>
                                    <th>City</th>
                                    <td>{contactUsInfo.city}</td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td>{contactUsInfo.state}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Link className="btn btn-primary" to="/contact-us/editor">Update</Link>
                </div>
            </div>
        )
    }
}

export default ContactUsDetail;