import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import WaitListService from '../../services/waitListService';
import ValidationService from '../../services/validationService';
import DatePicker from 'react-datepicker';

export default class WaitRequestEditor extends Component {
    
    state = {
        waitRequestID: '',
        selections: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
            color: '',
            expectedPurchaseDate: null
        },
        waitRequestData: {},
        validations: {},
        formSubmitted: false,
        loading: false
    };
    
    constructor(props) {
        super(props);
        const { authenticated } = props;
        if (typeof props.match.params.waitRequestID !== 'undefined') {
            this.state.waitRequestID = props.match.params.waitRequestID;
        }
        if (authenticated === false) {
            props.history.push('/login');
        }
    }

    componentDidMount() {
        const { waitRequestID } = this.state;
        if (waitRequestID !== '') {
            this.props.onShowLoading(true, 1);
            WaitListService.getWaitRequest(waitRequestID)
                .then(res => {
                    const { selections } = this.state;
                    const { firstName, lastName, email, phone, message, note, color, expectedPurchaseDate } = res.data;
                    selections.firstName = firstName !== undefined ? firstName : '';
                    selections.lastName = lastName !== undefined ? lastName : '';
                    selections.email = email !== undefined ? email : '';
                    selections.phone = phone !== undefined ? phone : '';
                    selections.message = message !== undefined ? message : '';
                    selections.note = note !== undefined ? note : '';
                    selections.color = color !== undefined ? color : '';
                    selections.expectedPurchaseDate = expectedPurchaseDate !== undefined ? new Date(expectedPurchaseDate) : null;
                    this.setState({ waitRequestData: res.data, selections: selections });
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in loading wait request data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    getColorOptions() {
        const colors = ["Black & Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"];
        return colors.map(color => <option value={color} key={color}>{color}</option>);
    }

    getTypeOptions() {
        const types = ["American", "European"];
        return types.map(type => <option value={type} key={type}>{type}</option>);
    }

    getFormClass(key) {
        const { formSubmitted, validations } = this.state;
        return formSubmitted === true && typeof validations[key] !== 'undefined' && validations[key].length > 0 ? 'is-invalid' : '';
    }

    handleSetFirstName = (event) => {
        const firstName = event.target.value;
        const { selections, validations } = this.state;
        if (firstName !== '') {
            delete validations.firstName;
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
            delete validations.lastName;
        } else {
            validations.lastName = 'Enter last Name';
        }
        selections.lastName = lastName;
        this.setState({ lastName, validations });
    }

    handleSetEmail = (event) => {
        const email = event.target.value;
        const { selections, validations } = this.state;
        if (email !== '') {
            delete validations.email;
            if (ValidationService.validateEmail(email) === true) {
                delete validations.email;
            } else {
                validations.email = 'Invalid email';
            }
        } else {
            validations.email = 'Enter email';
        }
        selections.email = email;
        this.setState({ selections, validations });
    }

    handleSetColor = (event) => {
        const color = event.target.value;
        const { selections } = this.state;
        selections.color = color;
        this.setState({ selections });
    }

    handleSetPhone = (event) => {
        let phone = event.target.value;
        const { selections, validations } = this.state;
        if (phone.length > 0) {
            phone = phone.replace(/\D/g, '');
            if (phone !== '') {
                delete validations.phone;
            } else {
                validations.phone = 'Enter phone';
            }
        } else {
            validations.phone = 'Enter phone number';
        }
        selections.phone = phone;
        this.setState({ selections, validations });
    }

    handleSelectExpectedPurchaseDate = (expectedPurchaseDate) => {
        const { selections, validations } = this.state;
        selections.expectedPurchaseDate = expectedPurchaseDate;
        if (expectedPurchaseDate !== null) {
            validations.expectedPurchaseDate = '';
        } else {
            validations.expectedPurchaseDate = 'Enter expected purchase date';
        }
        this.setState({ selections, validations });
    }

    handleSetMessage = (event) => {
        const message = event.target.value;
        const { selections, validations } = this.state;
        if (message !== '') {
            selections.message = message;
            delete validations.message;
        } else {
            validations.message = 'Enter message';
        }
        selections.message = message;
        this.setState({ selections, validations });
    }

    handleSetNote = (event) => {
        const note = event.target.value;
        const { selections } = this.state;
        selections.note = note;
        this.setState({ selections });
    }

    handleSubmitForm = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        const { waitRequestID, selections, validations, waitRequestData } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        selectionKeys.forEach(key => {
            if ((selections[key] === '' || selections[key] === null) && key !== 'color' && key !== 'note') {
                isValid = false;
                if (key === 'expectedPurchaseDate') {
                    validations[key] = `Select ${key}`;
                } else {
                    validations[key] = `Enter ${key}`;
                }
            } else {
                delete validations[key];
            }
        });
        const { firstName, lastName, email, phone, color, message, note, expectedPurchaseDate } = selections;
        if (isValid === true) {
            if (waitRequestID === '') {
                const createData = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    color: color.trim(),
                    expectedPurchaseDate: expectedPurchaseDate,
                    message: message.trim(),
                    note: note.trim(),
                    created: new Date(),
                    notified: null
                };
                this.props.onShowLoading(true, 1);
                WaitListService.createWaitRequest(createData)
                    .then(() => {
                        toastr.success('New wait request created.');
                        this.props.history.push('/wait-list');
                    })
                    .catch(err => {
                        console.log(err);
                        toastr.error('There was an erorr in creating a wait request');
                    })
                    .finally(() => {
                        this.props.onDoneLoading();
                    });
            } else {
                const updateData = waitRequestData;
                updateData.firstName = firstName.trim();
                updateData.lastName = lastName.trim();
                updateData.email = email.trim();
                updateData.phone = phone.trim();
                updateData.color = color;
                updateData.expectedPurchaseDate = expectedPurchaseDate;
                updateData.message = message.trim();
                updateData.note = note.trim();
                this.props.onShowLoading(true, 1);
                WaitListService.updateWaitRequest(waitRequestID, updateData)
                    .then(() => {
                        toastr.success('Updated a wait request');
                        this.props.history.push('/wait-list');
                    })
                    .catch(err => {
                        console.log(err);
                        toastr.error('There was an error in updating a wait request');
                    })
                    .finally(() => {
                        this.props.onDoneLoading();
                    });
            }
        }
    }

    handleUndoClicked = () => {
        const { selections, waitRequestData } = this.state;
        const { firstName, lastName, email, phone, message, note, color, expectedPurchaseDate } = waitRequestData;
        selections.firstName = firstName !== undefined ? firstName : '';
        selections.lastName = lastName !== undefined ? lastName : '';
        selections.email = email !== undefined ? email : '';
        selections.phone = phone !== undefined ? phone : '';
        selections.message = message !== undefined ? message : '';
        selections.note = note !== undefined ? note : '';
        selections.color = color !== undefined ? color : '';
        selections.expectedPurchaseDate = expectedPurchaseDate !== undefined ? new Date(expectedPurchaseDate) : null;
        this.setState({ selections, validations: {} });
    }

    render() {
        const { waitRequestID, selections, validations, formSubmitted } = this.state;
        const { firstName, lastName, email, phone, color, message, note, expectedPurchaseDate } = selections;
        return (
            <div className="card">
                <form noValidate>
                    <div className="card-header">
                        <strong>Wait Request Editor</strong>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="firstName" className={`form-label`}>First Name *</label>
                                    <input type="text" name="firstName" id="firstName" placeholder="Enter your first name" className={`form-control ${this.getFormClass('firstName')}`} value={firstName} onChange={this.handleSetFirstName} />
                                    {formSubmitted === true && validations.firstName && (
                                        <small className="text-danger">Enter first name</small>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="lastName" className={`form-label`}>Last Name *</label>
                                    <input type="text" name="lastName" id="lastName" placeholder="Enter your last name" className={`form-control ${this.getFormClass('lastName')}`} value={lastName} onChange={this.handleSetLastName} />
                                    {formSubmitted === true && validations.lastName && (
                                        <small className="text-danger">Enter last name</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="email" className={`form-label`}>Email *</label>
                                    <input type="text" name="email" id="email" placeholder="Enter your email" className={`form-control ${this.getFormClass('email')}`} value={email} onChange={this.handleSetEmail} />
                                    {formSubmitted === true && validations.email && (
                                        <small className="text-danger">{validations.email}</small>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="phone" className={`form-label`}>Phone number *</label>
                                    <input type="text" name="phone" id="phone" placeholder="Enter your phone number" className={`form-control ${this.getFormClass('phone')}`} value={phone} onChange={this.handleSetPhone} />
                                    {formSubmitted === true && validations.phone && (
                                        <small className="text-danger">{validations.phone}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <label htmlFor="color" className={`form-label`}>Color</label>
                                <select className={`form-control`} name="color" id="color" value={color} onChange={this.handleSetColor}>
                                    <option>--Select color for puppy--</option>
                                    {this.getColorOptions()}
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Expected Purchase Date *</label><br/>
                                <DatePicker className={`form-control ${this.getFormClass('expectedPurchaseDate')}`} selected={expectedPurchaseDate} onChange={this.handleSelectExpectedPurchaseDate} />
                                <br />{formSubmitted === true && validations.expectedPurchaseDate && (<small className="text-danger">{validations.expectedPurchaseDate}</small>)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="message" className={`form-label`}>Message *</label>
                                    <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                                    {formSubmitted === true && validations.message && (
                                        <small className="text-danger">{validations.message}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="message" className={`form-label`}>Note</label>
                                    <textarea row="4" className="form-control" placehodler="Note about the wait request" value={note} onChange={this.handleSetNote}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        {waitRequestID === '' && (
                            <button type="button" className="btn btn-primary" onClick={this.handleSubmitForm}>Create</button>
                        )}
                        {waitRequestID !== '' && (
                            <React.Fragment>
                                <button type="button" className="btn btn-success" onClick={this.handleSubmitForm}>Update</button>
                                <button type="button" className="btn btn-secondary ml-1" onClick={this.handleUndoClicked}><i className="fa fa-undo"></i> Undo</button>
                            </React.Fragment>
                        )}
                        <Link to="/wait-list" className="btn btn-secondary ml-1">Cancel</Link>
                    </div>
                </form>
            </div>
        )
    }
}