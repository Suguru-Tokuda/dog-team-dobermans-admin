import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ContactService from '../../services/contactService';
import ConstantsService from '../../services/constantsService';
import toastr from 'toastr';

class ContactUsEditor extends Component {
    state = {
        contactID: '',
        contactInfo: {},
        selections: {
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            state: '',
            email: '',
            phone: '',
            zip: ''
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

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        ContactService.getContactusInfo()
            .then(res => {
                const selections = {
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    street: res.data.street,
                    city: res.data.city,
                    state: res.data.state,
                    email: res.data.email,
                    phone: res.data.phone,
                    zip: res.data.zip
                };
                this.setState({
                    contacdtID: res.data.contactID,
                    selections: selections,
                    contactInfo: res.data
                });
            })
            .catch(err => {
               toastr.error('There was an error in loading contact us info');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
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
        const { contactInfo } = this.state;
        return Object.keys(contactInfo).length === 0 ? 'Create' : 'Update';
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
            if (phone.length === 10) {
                validations.phone = '';
                selections.phone = phone;
            } else if (phone.length < 10) {
                validations.phone = 'Enter a valid phone number';
            }
        } else {
            selections.phone = '';
            validations.phone = 'Enter phone number';
        }
        this.setState({ selections, validations });
    }

    handleSetZip = (event) => {
        let zip = event.target.value;
        const { selections, validations } = this.state;
        if (zip.length > 0) {
            zip = zip.replace(/\D/g, '');
            if (zip.length === 5) {
                validations.zip = '';
                selections.zip = zip;
            } else if (zip.length > 5) {
                validations.zip = 'Enter a valid zip code';
            }
        } else {
            selections.zip = '';
            selections.zip = 'Enter zip code'; 
        }
        this.setState({ selections, validations });
    }

    submitContactInfo = (event) => {
        this.setState({ formSubmitted: true });
        event.preventDefault();
        let isValid = true;
        const { selections, validations, contactInfo } = this.state;
        for (const key in selections) {
            if (selections[key] === '') {
                isValid = false;
                validations[key] = `Enter ${key}`;
            }
        }
        if (isValid === true) {
            this.props.onShowLoading(true, 1);
            const { firstName, lastName, street, city, state, email, phone, zip } = selections;
            const { contactID } = contactInfo;
            ContactService.updateContactdInfo(firstName, lastName, street, city, state, email, phone, zip, contactID)
                .then(() => {
                    if (Object.keys(contactInfo).length > 0) {
                        toastr.success('Successfully updated contact info');
                    } else {
                        toastr.success('Successfully created contact info');
                    }
                    this.props.history.push('/contact');
                })
                .catch((err) => {
                    console.log(err);
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
                            <input type="text" className={`form-control ${this.getErrorClass('firstName')}`} value={selections.firstName || ''} onChange={this.handleSetFirstName} />
                            {this.getErrorMessage('firstName')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Last Name</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('lastName')}`} value={selections.lastName || ''} onChange={this.handleSetLastName} />
                            {this.getErrorMessage('lastName')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Email</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('email')}`} value={selections.email || ''} onChange={this.handleSetEmail} />
                            {this.getErrorMessage('email')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Phone</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('phone')}`} value={selections.phone || ''} onChange={this.handleSetPhone} />
                            {this.getErrorMessage('phone')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Street</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('street')}`} value={selections.street || ''} onChange={this.handleSetStreet} />
                            {this.getErrorMessage('street')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">City</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('city')}`} value={selections.city || ''} onChange={this.handleSetCity} />
                            {this.getErrorMessage('city')}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">State</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <select className={`form-control ${this.getErrorClass('state')}`} value={selections.state || ''} onChange={this.handleSetState}>
                                <option value="">--Select State--</option>
                                {this.getStateOptions()}
                            </select>
                            {this.getErrorMessage('state')}
                        </div>
                    </div>
                    <div className="row form-group">
                    <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Zip</label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                            <input type="text" className={`form-control ${this.getErrorClass('zip')}`} value={selections.zip || ''} onChange={this.handleSetZip} />
                            {this.getErrorMessage('zip')}
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <Link to="/contact" className="btn btn-secondary">Back</Link>
                    <button type="submit" className="btn btn-primary ml-2" onClick={this.submitContactInfo}>{this.getSubmitBtnLabel()}</button>
                </div>
            </form>
        )
    }
}

export default ContactUsEditor;