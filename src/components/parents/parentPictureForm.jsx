import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import ImageCropModal from '../miscellaneous/imageCropModal';

class ParentPictureForm extends Component {
    state = {
        initiralParams: [],
        pictures: [],
        tempPictureFile: null,
        formSubmitted: false
    };

    constructor(props) {
        super(props);
        this.state.initialParams = props.initialParams;
        if (props.pictures.length > 0) {
            this.state.pictures = props.pictures;
        }
        if (Object.keys(this.state.initialParams).length === 0) {
            props.history.push('/parents');
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
        const { pictures } = this.state;
        let pictureCards, pictureAddCard;
        if (pictures.length > 0) {
            pictureCards = pictures.map((picture, i) => {
                const imageURL = URL.createObjectURL(picture);
                return (
                    <div key={`parent-picture-${i}`} className="col-3">
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
        if (pictures.length <= 4) {
            pictureAddCard = (
                <div className="col-3">
                    <button type="button" className="btn btn-primary" onClick={this.handleSelectImageClicked}><i className="fa fa-picture-o"></i> Select</button>
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

    handleSelectImageClicked() {
        $('#picture-upload').click();
    }

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempPictureFile: event.target.files[0] });
        }
        $('#picture-upload').val(null);
    }

    handleDeletePicture = (index) => {
        const { pictures } = this.state;
        if (pictures.length > 0) {
            pictures.splice(index, 1);
            this.setState({ pictures });
        }
    }

    handleSkipBtnClicked = (event) => {
        event.preventDefault();
        this.props.history.push('/parent/create/confirmation');
    }

    handleNextBtnClicked = (event) => {
        const { pictures } = this.state;
        event.preventDefault();
        this.setState({ formSubmitted: true });
        if (this.state.pictures.length > 0) {
            this.props.onToConfirmBtnClicked(pictures);
            this.props.history.push('/parent/create/confirmation');
        }
    }

    handleFinishImageCropping = (newFile) => {
        const { pictures } = this.state;
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
                        <Link className="btn btn-secondary ml-1" to="/parenets">Cancel</Link>
                    </div>
                </div>
                <ImageCropModal
                    imageFile={tempPictureFile}
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    handleResetTempPictureFile={this.handleResetTempPictureFile}
                    aspectRatio={1}
                />
            </React.Fragment>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(ParentPictureForm);