import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SortablePictureList from '../miscellaneous/sortablePictureList';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';
import ImageCropModal from '../miscellaneous/imageCropModal';
import ParentsService from '../../services/parentsService';
import $ from 'jquery';

class AboutUsPictureForm extends Component {
    state = {
        aboutUsID: '',
        tempPictureFile: null,
        tempPictureFileName: '',
        aboutUsDetail: {}
    };

    constructor(props) {
        super(props);
        this.state.aboutUsID = props.aboutUsID;
    }

    getPictures = () => {
        const { aboutUsDetail } = this.state;
        let pictures = [];
        let pictureCards, pictureAddCard;
        if (Object.keys(aboutUsDetail).length > 0) {
            pictures = aboutUsDetail.pictures;
            if (typeof pictures !== 'undefined' && pictures.length > 0) {
                pictureCards = <SortablePictureList
                                pictures={pictures}
                                onSortEnd={this.handleUpdatePictureOrder.bind(this)}
                                onDeletePictureBtnClicked={this.handleDeletePicture.bind(this)}
                                />;
            }
        }
        if (pictures.length <= 4) {
            pictureAddCard = (
                <div className="col-3">
                    <button type="button" className="btn btn-primary" onClick={this.handleSelectImageClicked}><i className="fa fa-picture-o"></i> Upload</button>
                    <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                </div>
            );
        }
        return (
            <React.Fragment>
                {pictureCards}
                {pictureAddCard}
            </React.Fragment>
        );
    }

    handleSelectImageClicked() {
        $('#picture-upload').click();
    }

    handleUpdatePictureOrder = (pictures) => {
        const { aboutUsID, aboutUsDetail } = this.state;
        aboutUsDetail.pictures = pictures;
        AboutUsService.updateAboutUs(aboutUsID, aboutUsDetail);
    }

    handleFinishImageCroppping = async (newFile) => {
        const { aboutUsID, aboutUsDetail } = this.state;
        this.props.showLoading({ reset: true, count: 1 });
        const newPicture = await ParentsService.uploadPicture(newFile);
        aboutUsDetail.pictures.push(newPicture);
        AboutUsService.updateAboutUs(aboutUsID, aboutUsDetail)
            .then(() => {
                toastr.success('Upload success');
            })
            .catch(() => {
                toastr.error('There was an error in uploading a file');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    handleDeletePicture = async (index) => {
        const { aboutUsID, aboutUsDetail } = this.state;
        const pictureToDelete = aboutUsDetail.pictures[index];
        aboutUsDetail.picture.splice(index, 1);
        AboutUsService.deletePicture(pictureToDelete.reference)
            .then(() => {
                AboutUsService.updateAboutUs(aboutUsID, aboutUsDetail)
                    .then(() => {
                        toastr.success('Successfully deleted the picture');
                        this.setState({ aboutUsDetail });
                    })
                    .catch(() => {
                        toastr.error('There was an error in deleting a picture');
                    })
            })
            .catch(() => {
                toastr.error('There was an error in deleting a picture');
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
                            {this.getPictures()}
                        </div>
                    </div>
                    <div className="card-footer">
                        <Link className="btn btn-sm btn-secondary" to={`/aboutUs/update/`}>Back</Link>
                    </div>
                </div>
                <ImageCropModal
                    imageFile={tempPictureFile}
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    handleResetTempPictureFile={this.handleResetTempPictureFile}
                    aspect={16/9}
                />
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutUsPictureForm);