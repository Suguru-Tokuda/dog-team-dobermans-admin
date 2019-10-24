import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PictureCropModal from '../miscellaneous/pictureCropModal';
import $ from 'jquery';

class PuppyPictureForm extends Component {
    state = {
        initialParams: {},
        pictures: [],
        tempPictureFile: null,
        formSubmitted: false,
    };

    constructor(props) {
        super(props);
        this.state.initialParams = props.initialParams;
        if (props.pictures.length > 0) {
            this.state.pictures = props.pictures;
        }
        if (Object.keys(this.state.initialParams).length === 0) {
            props.history.push('/puppies');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.initialParams !== nextProps.initialParams) {
            return { initialParams: nextProps.initialParams };
        } else {
            return null;
        }
    }

    getErrorMsg = () => {
        return this.state.pictures.length === 0 && this.state.formSubmitted === true ? <small className="text-danger">Select picture(s)</small> : null;
    }

    getPictures = () => {
        const pictures = this.state.pictures;
        let pictureCards, pictureAddCard;
        if (pictures.length > 0) {
            pictureCards = pictures.map((picture, i) => {
                const imageURL = URL.createObjectURL(picture);
                return (
                    <div key={`puppy-picture-${i}`} className="col-3">
                        <div className="row">
                            <div className="col-12">
                                <img src={imageURL} className="img-fluid" alt={imageURL} />
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-6">
                                <div className="float-left">
                                    <button className="btn btn-sm btn-danger" onClick={() => this.handleDeletePicture(i)}>x</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        if (this.state.pictures.length <= 4) {
            pictureAddCard = (
                <div className="col-3">
                    <label htmlFor="picture-upload" className="custom-file-upload">
                        <i className="fa fa-cloud-upload"></i> Upload
                    </label>
                    <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                </div>
            );
        }
        return (
            <div className="row">
                {pictureCards}
                {pictureAddCard}
            </div>
        );
    }

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.setState({ 
                    tempPictureFile: reader.result
                });
            });
            this.setState({
                tempPicureFileName: event.target.files[0].name
            });
            reader.readAsDataURL(event.target.files[0]);
        }
        $('#picture-upload').val(null);
    }

    handleDeletePicture = (index) => {
        const pictures = this.state.pictures;
        if (pictures.length > 0) {
            pictures.splice(index, 1);
            this.setState({ pictures });
        }
    }

    handleSkipBtnClicked = (event) => {
        event.preventDefault();
        this.props.history.push('/puppy/create/confirmation');
    }

    handleNextBtnClicked = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        if (this.state.pictures.length > 0) {
            this.props.onToConfirmBtnClicked(this.state.pictures);
            this.props.history.push('/puppy/create/confirmation');
        }
    }

    handleFinishImageCropping = (newFile) => {
        const pictures = this.state.pictures;
        pictures.push(newFile);
        this.setState({ 
            pictures: pictures,
            tempPictureFile: null
        });                        
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    render() {
        const { tempPictureFile } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h1>Pictures</h1>
                        <div className="row form-group">
                            <div className="col-12">
                                {this.getPictures()}
                            </div>
                            <div className="col-12">
                                {this.getErrorMsg()}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={this.handleNextBtnClicked} type="submit">Next</button>
                        <button className="btn btn-success ml-1" onClick={this.handleSkipBtnClicked} type="button">Skip</button>
                        <Link className="btn btn-secondary ml-1" to="/puppies">Cancel</Link>
                    </div>
                </div>
                <PictureCropModal 
                    pictureFile={tempPictureFile} 
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    onResetTempPictureFile={this.handleResetTempPictureFile} />
            </React.Fragment>
        );
    }
}

export default PuppyPictureForm;