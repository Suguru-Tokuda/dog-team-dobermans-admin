import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ParentService from '../../services/parentService';
import SortablePictureList from '../miscellaneous/sortablePictureList';
import toastr from 'toastr';
import ImageCropModal from '../miscellaneous/imageCropModal';
import ImageDeleteConfModal from '../miscellaneous/imageDeleteConfModal';
import $ from 'jquery';

class ParentPictureUpdateForm extends Component {
    state = {
        parentID: '',
        tempPictureFile: null,
        tempPictureFileName: '',
        parentDetail: {},
        imageToDelete: {},
        imageDeleteIndex: -1
    };

    constructor(props) {
        super(props);
        this.state.parentID = props.match.params.parentID;
    }

    componentDidMount() {
        const { parentID } = this.state;
        this.props.showLoading({ reset: true, count: 1 });
        ParentService.getParent(parentID)
            .then(res => {
                this.setState({ parentDetail: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading parent data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    getPictures = () => {
        const { parentDetail } = this.state;
        let pictures = [];
        let pictureCards, pictureAddCard;
        if (Object.keys(parentDetail).length > 0) {
            pictures = parentDetail.pictures;
            if (typeof pictures !== 'undefined' && pictures.length > 0) {
                pictureCards = <SortablePictureList
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
        const { parentID, parentDetail } = this.state;
        parentDetail.pictures = pictures;
        this.setState({ parentDetail });
        ParentService.updateParent(parentID, parentDetail);
    }

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempPictureFile: event.target.files[0] });
        }
    }

    handleFinishImageCropping = async (newFile) => {
        const { parentID, parentDetail } = this.state;
        this.props.showLoading({ reset: false, count: 1 });
        // upload a picture and get { reference, url }
        let newPicture;
        try {
            newPicture = await ParentService.uploadPicture(newFile);
        } catch (err) {
            console.log(err);
            toastr.error('There was an error in uploading a file');
            this.props.doneLoading({reset: true});
            return;
        }
        // push the new picture reference
        if (typeof newPicture !== 'undefined') {
            parentDetail.pictures.push(newPicture);
            ParentService.updateParent(parentID, parentDetail)
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
    }

    handleDeletePicture = (index) => {
        const { parentID, parentDetail } = this.state;
        const pictureToDelete = JSON.parse(JSON.stringify(parentDetail.pictures[index]));
        parentDetail.pictures.splice(index, 1);
        ParentService.deletePicture(pictureToDelete.reference)
            .then(() => {
                delete parentDetail.parentID;
                ParentService.updateParent(parentID, parentDetail)
                    .then(() => {
                        toastr.success('Successfully deleted the picture');
                        $('#imageDeleteConfModal').modal('hide');
                        $('.modal-backdrop').remove();
                        this.setState({ parentDetail });
                    })
                    .catch((err) => {
                        console.log(err);
                        toastr.error('There was an error in deleting a picture');
                    });
            })
            .catch(() => {
                toastr.error('There was an error in deleting a picture');
            });
    }

    openImageDeleteConfModal = (index) => {
        const imageToDelete = this.state.parentDetail.pictures[index];
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
        const { tempPictureFile, parentID, imageToDelete, imageDeleteIndex } = this.state;
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
                        <Link className="btn btn-sm btn-secondary" to={`/parent/update/${parentID}`}>Back</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(ParentPictureUpdateForm);