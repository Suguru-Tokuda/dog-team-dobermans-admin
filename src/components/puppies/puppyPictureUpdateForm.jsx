import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PuppyService from '../../services/puppyService';
import SortablePictureLlist from '../miscellaneous/sortablePictureList';
import toastr from 'toastr';
import ImageCropModal from '../miscellaneous/imageCropModal';
import ImageDeleteConfModal from '../miscellaneous/imageDeleteConfModal';
import $ from 'jquery';

class PuppyPictureUpdateForm extends Component {
    state = {
        puppyID: '',
        tempPictureFile: null,
        puppyData: {},
        imageToDelete: {},
        imageDeleteIndex: -1
    };

    constructor(props) {
        super(props);
        this.state.puppyID = props.match.params.puppyID;
    }

    componentDidMount() {
        const { puppyID } = this.state;
        this.props.showLoading({ reset: true, count: 1 });
        PuppyService.getPuppy(puppyID)
            .then(res => {
                this.setState({
                    puppyData: res.data
                });
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    getPictures = () => {
        let pictures = [];
        let pictureCards, pictureAddCard;
        if (Object.keys(this.state.puppyData).length > 0) {
            pictures = this.state.puppyData.pictures;
            if (typeof pictures !== 'undefined' && pictures.length > 0) {
                pictureCards = <SortablePictureLlist 
                                pictures={pictures} 
                                onSortEnd={this.handleUpdatePictureOrder.bind(this)} 
                                onDeletePictureBtnClicked={this.openImageDeleteConfModal.bind(this)}
                                />;
            }
        }
        if (pictures.length <= 4) {
            pictureAddCard = (
                <div className="col-4">
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
        const puppyData = this.state.puppyData;
        puppyData.pictures = pictures;
        this.setState({ puppyData });
        PuppyService.updatePuppy(this.state.puppyID, puppyData);
    }

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempPictureFile: event.target.files[0] });
        }
    }

    handleFinishImageCropping = async (newFile) => {
        this.props.showLoading({ reset: false, count: 1 });
        // upload a picture and get { reference, url }
        const puppyData = this.state.puppyData;
        let newPicture;
        try {
            newPicture = await PuppyService.uploadPicture(newFile);
        } catch (err) {
            toastr.error('There was an error in uploading a file');
        }
        if (typeof newPicture !== 'undefined') {
            // push the new picture reference
            puppyData.pictures.push(newPicture);
            PuppyService.updatePuppy(this.state.puppyID, puppyData)
                .then(res => {
                    toastr.success('Upload success');
                    this.setState({ tempPictureFile: null })
                })
                .catch(err => {
                    toastr.error('There was an error in uploading a file');
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    handleDeletePicture = async (index) => {
        const pictures = this.state.puppyData.pictures;
        const puppyData = this.state.puppyData;
        const pictureToDelete = pictures[index];
        pictures.splice(index, 1);
        puppyData.pictures = pictures;
        PuppyService.deletePicture(pictureToDelete.reference)
            .then(res => {
                delete puppyData.puppyID;
                PuppyService.updatePuppy(this.state.puppyID, puppyData)
                    .then(res => {
                        toastr.success('Successfully deleted the picture');
                        $('#imageDeleteConfModal').modal('hide');
                        $('.modal-backdrop').remove();
                        this.setState({ puppyData });
                    })
                    .catch(err => {
                        toastr.error('There was an error in deleting a picture');
                    });
            })
            .catch(err => {
                toastr.error('There was an error in deleting a picture')
            });
    }

    openImageDeleteConfModal = (index) => {
        const imageToDelete = this.state.puppyData.pictures[index];
        this.setState({ imageToDelete: imageToDelete, imageDeleteIndex: index });
        $('#imageDeleteConfModal').modal('show');
    }

    handleCancelDeleteBtnClicked = () => {
        $('#imageDeleteConfModal').modal('hide');
        $('.modal-backdrop').remove();
        this.setState({ imageToDelete: {}, imageDeleteIndex: -1 });
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    render() {
        const { tempPictureFile, puppyID, imageToDelete, imageDeleteIndex } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h1>Pictures</h1>
                        <div className="row form-group" style={{padding: '25px'}}>
                            {this.getPictures()}
                        </div>
                    </div>
                    <div className="card-footer">
                        <Link className="btn btn-sm btn-secondary" to={`/puppy/update/${puppyID}`}>Back</Link>
                    </div>
                </div>
                <ImageCropModal
                    imageFile={tempPictureFile}
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    handleResetTempPictureFile={this.handleResetTempPictureFile}
                    aspectRatio={1}
                />
                <ImageDeleteConfModal
                    image={imageToDelete}
                    index={imageDeleteIndex}
                    onCancelBtnClicked={this.handleCancelDeleteBtnClicked}
                    onDoDeleteBtnClicked={this.handleDeletePicture.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(PuppyPictureUpdateForm);