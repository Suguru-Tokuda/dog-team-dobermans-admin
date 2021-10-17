import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ContactService from '../../services/contactService';
import UtilService from '../../services/utilService';
import toastr from 'toastr';

class ContactUsDetail extends Component {
    state = {
        contactInfo: {}
    };

    componentDidMount() {
        this.props.showLoading({ reset: true, count: 1 });
        ContactService.getContact()
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsDetail);