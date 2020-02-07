import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesService from '../../services/puppiesService';
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
        this.props.onShowLoading(true, 1);
        PuppiesService.getPuppy(puppyID)
            .then(res => {
                this.setState({
                    puppyData: res.data
                });
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                this.props.onDoneLoading();
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
                    <label htmlFor="picture-upload" className="custom-file-upload">
                        <i className="fa fa-picture-o"></i> Upload
                    </label>
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

    handleUpdatePictureOrder = (pictures) => {
        const puppyData = this.state.puppyData;
        puppyData.pictures = pictures;
        this.setState({ puppyData });
        PuppiesService.updatePuppy(this.state.puppyID, puppyData);
    }

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempPictureFile: event.target.files[0] });
        }
    }

    handleFinishImageCropping = async (newFile) => {
        this.props.onShowLoading(false, 1);
        // upload a picture and get { reference, url }
        const newPicture = await PuppiesService.uploadPicture(newFile);
        const puppyData = this.state.puppyData;
        // push the new picture reference
        puppyData.pictures.push(newPicture);
        PuppiesService.updatePuppy(this.state.puppyID, puppyData)
            .then(res => {
                toastr.success('Upload success');
                this.setState({ tempPictureFile: null })
            })
            .catch(err => {
                toastr.error('There was an error in uploading a file');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleDeletePicture = async (index) => {
        const pictures = this.state.puppyData.pictures;
        const puppyData = this.state.puppyData;
        const pictureToDelete = pictures[index];
        pictures.splice(index, 1);
        puppyData.pictures = pictures;
        PuppiesService.deletePicture(pictureToDelete.reference)
            .then(res => {
                delete puppyData.puppyID;
                PuppiesService.updatePuppy(this.state.puppyID, puppyData)
                    .then(res => {
                        toastr.success('Successfully deleted the picture');
                        $('#imageDeleteConfModal').modal('hide');
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
                    onShowLoading={this.props.onShowLoading.bind(this)} 
                    onDoneLoading={this.props.onDoneLoading.bind(this)}
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

export default PuppyPictureUpdateForm;