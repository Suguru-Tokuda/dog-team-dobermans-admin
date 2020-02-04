import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ImageCropModal from '../miscellaneous/imageCropModal';
import TestimonialService from '../../services/testimonialService';
import ValidationService from '../../services/validationService';
import toastr from 'toastr';
import $ from 'jquery';

export default class TestimonialEditor extends Component {
    state = {
        testimonialID: '',
        testimonialData: {},
        selections: {
            firstName: '',
            lastName: '',
            dogName: '',
            email: '',
            message: '',
            picture: null
        },
        tempImageFile: null,
        imageURL: '',
        validations: {},
        formSubmitted: false
    }

    constructor(props) {
        super(props);
        const { authenticated } = props;
        if (typeof props.match.params.testimonialID !== 'undefined') {
            this.state.testimonialID = props.match.params.testimonialID;
        }
        if (authenticated === false) {
            props.history.push('/login');
        }
    }

    componentDidMount() {
        const { testimonialID } = this.state;
        if (testimonialID !== '') {
            this.props.onShowLoading(true, 1);
            TestimonialService.getTestimonial(testimonialID)
                .then(res => {
                    if (typeof res.data !== 'object') {
                        this.props.history.push('/testimonials');
                        toastr.error('There was an error in loading testimonial data');
                    } else {
                        const testimonial = res.data;
                        const selections = {
                            firstName: testimonial.firstName,
                            lastName: testimonial.lastName,
                            dogName: testimonial.dogName,
                            email: testimonial.email,
                            message: testimonial.message,
                            picture: testimonial.picture
                        };
                        let imageURL = '';
                        if (testimonial.picture.url) {
                            imageURL = testimonial.picture.url;
                        }
                        this.setState({ testimonialData: res.data, selections: selections, imageURL: imageURL });
                    }
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in loading testimonial data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
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
            validations.lastName = 'Enter last name';
        }
        selections.lastName = lastName;
        this.setState({ lastName, validations });
    }

    handleSetDogName = (event) => {
        const dogName = event.target.value;
        const { selections, validations } = this.state;
        if (dogName !== '') {
            delete validations.dogName;
        } else {
            validations.dogName = 'Enter dog\'s name';
        }
        selections.dogName = dogName;
        this.setState({ dogName, validations });
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

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempImageFile: event.target.files[0] });
        }
        $('#picture-upload').val(null);
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

    handleFinishImageCropping = (newFile) => {
        const { selections } = this.state;
        selections.picture = newFile;
        const newImageURL = URL.createObjectURL(newFile);
        const { imageURL } = this.state;
        if (imageURL !== '') {
            URL.revokeObjectURL(imageURL);
        }
        this.setState({ selections, imageURL: newImageURL });
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempImageFile: null });
    }

    handleClearImageBtnClicked = () => {
        this.setState({ tempImageFile: null, imageURL: '' });
    }

    handleCreateTestimonial = async (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        const { selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        selectionKeys.forEach(key => {
            if (selections[key] === '' || selections[key] === null) {
                isValid = false;
                if (key !== 'picture') {
                    validations[key] = `Enter ${key}`;
                }
            } else {
                delete validations[key];
            }
            if (key === 'email') {
                if (selections[key].length > 0) {
                    if (ValidationService.validateEmail(selections[key]) === true) {
                        delete validations[key];
                    } else {
                        isValid = false;
                        validations[key] = 'Invalid email';
                    }
                }
            }
        });
        if (isValid === true) { 
            const { firstName, lastName, dogName, email, message, picture } = selections;
            let image = null;
            this.props.onShowLoading(true, 1);
            if (picture !== null) {
                image = await TestimonialService.uploadPicture(picture, dogName);
            }
            TestimonialService.createTestimonial(firstName, lastName, dogName, email.toLowerCase(), message, image, new Date())
                .then(() => {
                    toastr.success('Thanks for submitting a testimonial! We will review it within a coule business days.');
                    const selections = {
                        firstName: '',
                        lastName: '',
                        dogName: '',
                        email: '',
                        message: '',
                        picture: null
                    };
                    const { imageURL } = this.state;
                    URL.revokeObjectURL(imageURL); // Revoke the URL before erase it.
                    this.setState({ selections: selections, tempImageFile: null, imageURL: '', validations: {}, formSubmitted: false });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        } else {
            this.setState({ validations });
        }
    }

    handleUpdateTestimonial = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        const { selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        selectionKeys.forEach(key => {
            if (selections[key] === '' || selections[key] === null) {
                isValid = false;
                if (key !== 'picture') {
                    validations[key] = `Enter ${key}`;
                }
            } else {
                delete validations[key];
            }
            if (key === 'email') {
                if (selections[key].length > 0) {
                    if (ValidationService.validateEmail(selections[key]) === true) {
                        delete validations[key];
                    } else {
                        isValid = false;
                        validations[key] = 'Invalid email';
                    }
                }
            }
        });
        if (isValid === true) {
            const { firstName, lastName, dogName, email, message, picture } = selections;
            this.props.onShowLoading(true, 1);
            let image = null
            if (typeof picture.reference === 'undefined') {

            }
        }

    }

    render() {
        const { testimonialID, testimonialData, selections, tempImageFile, imageURL, validations, formSubmitted } = this.state;
        const { firstName, lastName, dogName, email, message } = selections;
        return (
            <React.Fragment>
                <div className="card">
                    <form noValidate>
                        <div className="card-header">
                            <strong>Testimonial Editor</strong>
                        </div>
                        <div className="card-body">
                        <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="firstName" className={`form-label`}>First Name *</label>
                                            <input type="text" name="firstName" id="firstName" placeholder="First name" className={`form-control ${this.getFormClass('firstName')}`} value={firstName} onChange={this.handleSetFirstName} />
                                            {formSubmitted === true && validations.firstName && (
                                                <small className="text-danger">Enter first name</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="lastName" className={`form-label`}>Last Name *</label>
                                            <input type="text" name="lastName" id="lastName" placeholder="Last name" className={`form-control ${this.getFormClass('lastName')}`} value={lastName} onChange={this.handleSetLastName} />
                                            {formSubmitted === true && validations.lastName && (
                                                <small className="text-danger">Enter last name</small>
                                            )}
                                        </div>
                                    </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="dogName" className={`form-label`}>Dog Name *</label>
                                    <input type="text" name="dogName" id="dogName" placeholder="Dog's name" className={`form-control ${this.getFormClass('dogName')}`} value={dogName} onChange={this.handleSetDogName} />
                                    {formSubmitted === true && validations.dogName && (
                                        <small className="text-danger">Enter your dog's name</small>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="email" className={`form-label`}>Email *</label>
                                    <input type="email" name="email" id="email" placeholder="Email" className={`form-control ${this.getFormClass('email')}`} value={email} onChange={this.handleSetEmail} />
                                    {formSubmitted === true && validations.email && (
                                        <small className="text-danger">{validations.email}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <label>Picture of your dog</label><br />
                                <label htmlFor="picture-upload" className="btn btn-primary">
                                    <i className="fa fa-picture-o"></i> Select
                                </label>
                                <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                                {formSubmitted === true && validations.picture && (
                                    <React.Fragment>
                                        <br />
                                        <small className="text-danger">Select picture</small>
                                    </React.Fragment>
                                )}
                            </div>
                            {imageURL !== '' && (
                                <div className="col-sm-6">
                                    <img className="img-fluid rounded-circle" src={imageURL} alt={imageURL} /><br /><br />
                                    <button className="btn btn-secondary" onClick={this.handleClearImageBtnClicked}>Clear</button>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className={`form-label`}>Message *</label>
                            <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                            {formSubmitted === true && validations.message && (
                                <small className="text-danger">{validations.message}</small>
                            )}
                        </div>
                        </div>
                        <div className="card-footer">
                            {testimonialID === '' && (
                                <button type="button" className="btn btn-primary">Create</button>
                            )}
                            {(testimonialID !== '' && Object.keys(testimonialData).length > 0) && (
                                <button type="button" className="btn btn-success ml-1">Update</button>
                            )}
                            <Link to="/testimonials" className="btn btn-secondary ml-1">Cancel</Link>
                        </div>
                    </form>
                </div>
                <ImageCropModal
                    imageFile={tempImageFile}
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    handleResetTempPictureFile={this.handleResetTempPictureFile}
                    onShowLoading={this.props.onShowLoading.bind(this)} 
                    onDoneLoading={this.props.onDoneLoading.bind(this)}
                    aspectRatio={1}
                />
            </React.Fragment>
        );
    }
}