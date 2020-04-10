import React, { Component } from 'react';
import toastr from 'toastr';
import $ from 'jquery';
import BuyersService from '../../services/buyersService';
import ConstantsService from '../../services/constantsService';
import ValidationService from '../../services/validationService';

class BuyerRegistrationModal extends Component {
    state = {
        buyerID: undefined,
        buyerToUpdate: {},
        selections: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            city: '',
            state: ''
        },
        validations: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            city: '',
            state: ''
        },
        formSubmitted: false
    };

    componentDidUpdate() {
        $('#buyerRegistrationModal').on('hidden.bs.modal', () => {
            const { buyerID } = this.state;
            if (typeof buyerID === 'undefined') {
                this.setState({
                    selections: {
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        city: '',
                        state: ''
                    },
                    validations: {
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        city: '',
                        state: ''
                    },
                    formSubmitted: false
                });
            }
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.buyerID !== prevState.buyerID) {
            const state = prevState;
            if (typeof nextProps.buyerID !== 'undefined') {
                const { buyerToUpdate } = nextProps;
                state.selections = {
                    firstName: buyerToUpdate.firstName,
                    lastName: buyerToUpdate.lastName,
                    email: buyerToUpdate.email,
                    phone: buyerToUpdate.phone,
                    city: buyerToUpdate.city,
                    state: buyerToUpdate.state
                };
                state.validations = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    city: '',
                    state: ''
                };
                state.buyerToUpdate = nextProps.buyerToUpdate;
                state.buyerID = nextProps.buyerID;
            } else if (typeof nextProps.buyerID === 'undefined') {
                state.selections = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    city: '',
                    state: ''
                };
                state.validations = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    city: '',
                    state: ''
                };
                state.buyerID = undefined;
                state.buyerToUpdate = {};
            }
            return state;
        }
        return null;
    }

    getStateOptions = () => {
        const states = ConstantsService.getStates();
        return states.map(state => <option key={state.abbreviation} value={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>);
    }

    getErrorMsg(key) {
        const { validations, formSubmitted } = this.state;
        return (validations[key] !== '' && formSubmitted === true ? <span className="text-danger">{validations[key]}</span> : null);
    }

    getErrorClass(key) {
        const { validations, formSubmitted } = this.state;
        return (formSubmitted === true && validations[key] !== '') ? 'is-invalid' : '';
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
            validations.lastName = 'Enter first name';
        }
        selections.lastName = lastName;
        this.setState({ selections, validations });
    }

    handleSetEmail = async (event) => {
        const email = event.target.value.trim();
        const { selections, validations } = this.state;
        if (email !== '') {
            if (ValidationService.validateEmail(email) === true) {
                validations.email = '';
            } else {
                validations.email = 'Enter valid email';
            }
        } else {
            validations.email = 'Enter email name';
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

    handleSetCity = (event) => {
        const city = event.target.value;
        const { selections, validations } = this.state;
        if (city !== '') {
            validations.name = '';
        } else {
            validations.name = 'Enter first name';
        }
        selections.city = city;
        this.setState({ selections, validations });
    }

    handleCreateBtnClicked = async (event) => {
        this.setState({ formSubmitted: true });
        event.preventDefault();
        let isValid = true;
        const { selections, validations } = this.state;
        for (const key in selections) {
            if (selections[key] === '') {
                isValid = false;
                validations[key] = `Enter ${key}`;
            }
        }
        if (isValid === true) {
            selections.firstName = selections.firstName.trim();
            selections.firstName = `${selections.firstName.substring(0, 1).toUpperCase()}${selections.firstName.substring(1)}`;
            selections.lastName = selections.lastName.trim();
            selections.lastName = `${selections.lastName.substring(0, 1).toUpperCase()}${selections.lastName.substring(1)}`;
            selections.email = selections.email.toLowerCase().trim();
            selections.phone = selections.phone.trim();
            selections.state = selections.state.trim();
            selections.city = selections.city.trim();
            selections.city = `${selections.city.substring(0, 1).toUpperCase()}${selections.city.substring(1)}`;
            let emailAvailable = false;
            this.props.onShowLoading(true, 1);
            try {
                const res = await BuyersService.checkEmailAvailability(selections.email);
                emailAvailable = res.data;
                if (emailAvailable === false)
                    validations.email = 'Email taken already.';
            } catch {
                toastr.error('There was an error in checking email availability.');
            }
            if (emailAvailable === true) {
                this.props.onShowLoading(true, 1);
                setTimeout(() => {
                    BuyersService.createBuyer(selections.firstName, selections.lastName, selections.email, selections.phone, selections.state, selections.city)
                        .then(res => {
                            this.props.onBuyerSelected(res.data.buyerID);
                            this.setState({
                                selections: {
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    phone: '',
                                    city: '',
                                    state: ''
                                },
                                validations: {
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    phone: '',
                                    city: '',
                                    state: ''
                                },
                                formSubmitted: false
                            });
                            toastr.success('A new buyer created');
                            $('#buyerRegistrationModal').modal('hide');
                            $('.modal-backdrop').remove();
                        })
                        .catch(err => {
                            toastr.error('There was an error in creating a buyer');
                        })
                        .finally(() => {
                            this.props.onDoneLoading(true);
                        });
                }, 500);
            } else {
                this.props.onDoneLoading(true);
            }
        }
        this.setState({ validations });
    }

    handleUpdateBtnClicked = async (event) => {
        this.setState({ formSubmitted: true });
        event.preventDefault();
        let isValid = true;
        const { buyerID, selections, validations } = this.state;
        for (const key in selections) {
            if (selections[key] === '') {
                isValid = false;
                validations[key] = `Enter ${key}`;
            }
        }
        if (isValid === true) {
            this.props.onShowLoading(true, 2);
            selections.firstName = `${firstName.trim().substring(0, 1).toUpperCase()}${firstName.trim().substring(1)}`;
            selections.lastName = `${lastName.trim().substring(0, 1).toUpperCase()}${lastName.trim().substring(1)}`;
            selections.email = selections.email.toLowerCase().trim();
            selections.phone = selections.phone.trim();
            selections.state = selections.state.trim();
            selections.city = `${selections.city.trim().substring(0, 1).toUpperCase()}${selections.city.trim().substring(1)}`;
            const { firstName, lastName, email, phone, city, state } = selections;
            const { puppyIDs } = this.state.buyerToUpdate;
            let emailAvailable = true;
            try {
                const res = await BuyersService.checkEmailAvailability(email, buyerID);
                emailAvailable = res.data;
                if (emailAvailable === false)
                    validations.email = 'Email taken already.';
                if (emailAvailable === true) {
                    this.props.onShowLoading(true, 1);
                } else {
                    this.props.onDoneLoading(true);
                }
            } catch {
                toastr.error('There was an error in checking email availability.');
            }
            if (emailAvailable === true) {
                setTimeout(() => {
                    BuyersService.updateBuyer(buyerID, firstName, lastName, email, phone, state, city, puppyIDs)
                        .then(() => {
                            this.props.onBuyerUpdated();
                            toastr.success('Successfully updated a buyer');
                            $('#buyerRegistrationModal').modal('hide');
                            $('.modal-backdrop').remove();
                        })
                        .catch(err => {
                            console.log(err);
                            toastr.error('There was an error in updating the buyer information')
                        })
                        .finally(() => {
                            this.props.onDoneLoading(true);
                        });
                }, 500);
            }
        }
        this.setState({ validations });
    }

    handleCancelBtnClicked = () => {
        $('#buyerRegistrationModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    render() {
        const { buyerID, selections } = this.state;
        return (
            <div className="modal fade" id="buyerRegistrationModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                   <div className="modal-content">
                       <form name="buyerRegistrationForm" noValidate>
                           <div className="modal-header">
                               <h3>Buyer Registration Form</h3>
                           </div>
                            <div className="modal-body">
                                <div className="row form-group">
                                    <label className="col-2">
                                        First Name
                                    </label>
                                    <div className="col-10">
                                        <input type="text" value={selections.firstName} className={`form-control ${this.getErrorClass('firstName')}`} onChange={this.handleSetFirstName} />
                                        {this.getErrorMsg('firstName')}
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-2">
                                        Last Name
                                    </label>
                                    <div className="col-10">
                                        <input type="text" value={selections.lastName} className={`form-control ${this.getErrorClass('lastName')}`} onChange={this.handleSetLastName} />
                                        {this.getErrorMsg('lastName')}
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-2">
                                        Phone
                                    </label>
                                    <div className="col-10">
                                        <input type="text" value={selections.phone} className={`form-control ${this.getErrorClass('phone')}`} onChange={this.handleSetPhone} />
                                        {this.getErrorMsg('phone')}
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-2">
                                        Email
                                    </label>
                                    <div className="col-10">
                                        <input type="text" value={selections.email} className={`form-control ${this.getErrorClass('email')}`} onChange={this.handleSetEmail} />
                                        {this.getErrorMsg('email')}
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-2">
                                        State
                                    </label>
                                    <div className="col-10">
                                        <select value={selections.state} className={`form-control ${this.getErrorClass('state')}`} onChange={this.handleSetState}>
                                            <option value="">--Select State--</option>
                                            {this.getStateOptions()}
                                        </select>
                                        {this.getErrorMsg('state')}
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-2">
                                        City
                                    </label>
                                    <div className="col-10">
                                        <input type="text" className={`form-control ${this.getErrorClass('city')}`} value={selections.city} onChange={this.handleSetCity}/>
                                        {this.getErrorMsg('city')}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {typeof buyerID === 'undefined' && (
                                    <button type="submit" className="btn btn-success" onClick={this.handleCreateBtnClicked}>Create</button>
                                )}
                                {typeof buyerID !== 'undefined' && (
                                    <button type="submit" className="btn btn-success" onClick={this.handleUpdateBtnClicked}>Update</button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={this.handleCancelBtnClicked}>Cancel</button>
                            </div>
                       </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default BuyerRegistrationModal;