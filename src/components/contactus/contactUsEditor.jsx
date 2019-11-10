import React, { Component } from 'react';
import ContactUsService from '../../services/contactUsService';
import ConstantsService from '../../services/constantsService';
import toastr from 'toastr';

class ContactUsEditor extends Component {
    state = {
        contactUsID: '',
        contactUsInfo: {},
        selections: {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            state: '',
            email: '',
            phone: ''
        },
        validations: {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            state: '',
            email: '',
            phone: ''
        },
        formSubmitted: false
    };

    constructor(props) {
        super(props);
        console.log(props.contactUsInfo);
        const { contactUsInfo } = props;
        this.state.contactUsInfo = contactUsInfo;
        this.contactUsID = contactUsInfo.contactUsID;
        this.state.selections.firstName = contactUsInfo.firstName;
        this.state.selections.lastName = contactUsInfo.lastName;
        this.state.selections.street = contactUsInfo.street;
        this.state.selections.city = contactUsInfo.city;
        this.state.selections.state = contactUsInfo.state;
        this.state.selections.email = contactUsInfo.email;
        this.state.selections.phone = contactUsInfo.phone;
    }

    componentDidUpdate(props) {
        if (JSON.stringify(this.state.contactUsInfo) !== JSON.stringify(props.contactUsInfo)) {
            const { contactUsInfo } = props;
            const { selections } = this.state;
            selections.firstName = contactUsInfo.firstName;
            selections.lastName = contactUsInfo.lastName;
            selections.street = contactUsInfo.street;
            selections.city = contactUsInfo.city;
            selections.state = contactUsInfo.state;
            selections.email = contactUsInfo.email;
            selections.phone = contactUsInfo.phone;
            this.setState({ contactUsInfo: props.contactUsInfo });
        }
    }

    getStateOptions() {
        const states = ConstantsService.getStates();
        return states.map(state => <option key={state.abbreviation} value={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>);
    }

    getErrorClass(key) {
        const { validations, formSubmitted } = this.state;
        return (formSubmitted === true && validations[key] !== '') ? 'is-invalid' : '';
    }

    getErrorMessage(key) {
        const { validations, formSubmitted } = this.state;
        return (formSubmitted === true && validations[key] !== '') ? <small className="text-danger">{validations[key]}</small> : null;
    }

    getSubmitBtnLabel() {
        const { contactUsInfo } = this.state;
        return Object.keys(contactUsInfo).length === 0 ? 'Create' : 'Update';
    }

    handleSetFirstName = (event) => {
        const firstName = event.target.value;
        const { selections, validations } = this.state;
        if (firstName !== '') {
            validations.firstName = '';
        } else {
            validations.firstName = 'Enter first name';
        }
        selections.firstName = firstName;
        this.setState({ selections, validations });
    }

    handleSetLastName = (event) => {
        const lastName = event.target.value;
        const { selections, validations } = this.state;
        if (lastName !== '') {
            validations.lastName = '';
        } else {
            validations.lastName = 'Enter last name';
        }
        selections.lastName = lastName;
        this.setState({ selections, validations });
    }

    handleSetStreet = (event) => {
        const street = event.target.value;
        const { selections, validations } = this.state;
        if (street !== '') {
            validations.street = '';
        } else {
            validations.street = 'Enter street';
        }
        selections.street = street;
        this.setState({ selections, validations });
    }

    handleSetCity = (event) => {
        const city = event.target.value;
        const { selections, validations } = this.state;
        if (city !== '') {
            validations.city = '';
        } else {
            validations.city = 'Enter city';
        }
        selections.city = city;
        this.setState({ selections, validations });
    }

    handleSetState = (event) => {
        const state = event.target.value;
        const { selections, validations } = this.state;
        if (state !== '') {
            validations.state = '';
        } else {
            validations.state = 'Select state';
        }
        selections.state = state;
        this.setState({ selections, validations });
    }

    handleSetEmail = (event) => {
        const email = event.target.value.trim();
        const { selections, validations } = this.state;
        if (email !== '') {
            validations.email = '';
        } else {
            validations.email = 'Enter email';
        }
        selections.email = email;
        this.setState({ selections, validations });
    }

    handleSetPhone = (event) => {
        let phone = event.target.value;
        const { selections, validations } = this.state;
        if (phone.length > 0) {
            phone = phone.replace(/\D/g, '');
            if (phone !== '') {
                validations.phone = '';
                selections.phone = phone;
            } else {
                validations.phone = 'Enter phone number';
            }
        } else {
            selections.phone = '';
            validations.phone = 'Enter phone number';
        }
        this.setState({ selections, validations });
    }

    submitContactInfo = (event) => {
        this.setState({ formSubmitted: true });
        event.preventDefault();
        let isValid = true;
        const { selections, validations, contactUsInfo } = this.state;
        for (const key in selections) {
            if (selections[key] === '') {
                isValid = false;
                validations[key] = `Enter ${key}`;
            }
        }
        if (isValid === true) {
            this.props.onShowLoading(true, 1);
            const { firstName, lastName, street, city, state, email, phone } = selections;
            const { contactUsID } = contactUsInfo;
            ContactUsService.updateContactdInfo(firstName, lastName, street, city, state, email, phone, contactUsID)
                .then(() => {
                    if (Object.keys(contactUsInfo).length > 0) {
                        toastr.success('Successfully updated contact info');
                    } else {
                        toastr.success('Successfully created contact info');
                    }
                    this.props.onUpdateContactUsInfo();
                    this.props.history.push('/contact-us/view');
                })
                .catch(() => {
                    toastr.error('There was an error in posting contact us data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    render() {
        const { selections } = this.state;
        return (
            <form className="card" noValidate>
                <div className="card-body">
                    <h2 className="mb-5">Contact Us Editor</h2>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">First Name</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('firstName')}`} value={selections.firstName} onChange={this.handleSetFirstName} />
                            {this.getErrorMessage('firstName')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Last Name</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('lastName')}`} value={selections.lastName} onChange={this.handleSetLastName} />
                            {this.getErrorMessage('lastName')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Email</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('email')}`} value={selections.email} onChange={this.handleSetEmail} />
                            {this.getErrorMessage('email')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Phone</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('phone')}`} value={selections.phone} onChange={this.handleSetPhone} />
                            {this.getErrorMessage('phone')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Street</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('street')}`} value={selections.street} onChange={this.handleSetStreet} />
                            {this.getErrorMessage('street')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">City</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('city')}`} value={selections.city} onChange={this.handleSetCity} />
                            {this.getErrorMessage('city')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">State</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <select className={`form-control ${this.getErrorClass('state')}`} value={selections.state} onChange={this.handleSetState}>
                                <option value="">--Select State--</option>
                                {this.getStateOptions()}
                            </select>
                            {this.getErrorMessage('state')}
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button type="submit" className="btn btn-primary" onClick={this.submitContactInfo}>{this.getSubmitBtnLabel()}</button>
                </div>
            </form>
        )
    }
}

export default ContactUsEditor;