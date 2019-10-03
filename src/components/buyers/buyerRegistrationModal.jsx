import React, { Component } from 'react';
import toastr from 'toastr';
import $ from 'jquery';
import BuyersService from '../../services/buyersService';
import ConstantsService from '../../services/constantsService';

class BuyerRegistrationModal extends Component {
    state = {
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
        showModal: false,
        formSubmitted: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.showModal !== prevState.showModal) {
            return { showModal: nextProps.showModal }
        }
        return null;
    }

    componentDidUpdate() {
        if (this.state.showModal === true) {
            $('#buyerRegistrationModal').modal('show');
        }
    }

    getStateOptions = () => {
        const states = ConstantsService.getStates();
        return states.map(state => {
            return <option key={state.abbreviation} value={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>
        });
    }

    getErrorMsg(key) {
        const { validations, formSubmitted } = this.state;
        return (validations[key] !== '' && formSubmitted === true ? <span className="text-danger">{`Enter ${key}`}</span> : null);
    }

    getErrorClass(key) {
        const { validations, formSubmitted } = this.state;
        return (formSubmitted === true && validations[key] !== '') ? 'is-invalid' : '';
    }

    handleSetFirstName = (event) => {
        const firstName = event.target.value.trim();
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
        const lastName = event.target.value.trim();
        const { selections, validations } = this.state;
        if (lastName !== '') {
            validations.lastName = '';
        } else {
            validations.lastName = 'Enter first name';
        }
        selections.lastName = lastName;
        this.setState({ selections, validations });
    }

    handleSetEmail = (event) => {
        const email = event.target.value.trim();
        const { selections, validations } = this.state;
        if (email !== '') {
            validations.name = '';
        } else {
            validations.name = 'Enter first name';
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
        const city = event.target.value.trim();
        const { selections, validations } = this.state;
        if (city !== '') {
            validations.name = '';
        } else {
            validations.name = 'Enter first name';
        }
        selections.city = city;
        this.setState({ selections, validations });
    }

    handleCreateBtnClicked = (event) => {
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
            this.props.onShowLoading(true, 1);
            BuyersService.createBuyer(selections)
                .then(res => {
                    console.log(res.data);
                    // this.props.onBuyerCreated(res.data.id);
                })
                .catch(err => {
                    toastr.error('There was an error in creating a buyer');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    handleCancelBtnClicked = () => {
        $('#buyerRegistrationModal').modal('hide');
    }

    render() {
        const { selections } = this.state;
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
                                <button type="submit" className="btn btn-success" onClick={this.handleCreateBtnClicked}>Create</button>
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