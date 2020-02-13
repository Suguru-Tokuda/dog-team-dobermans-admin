import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentsService from '../../services/parentsService';
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
        this.props.onShowLoading(true, 1);
        ParentsService.getParent(parentID)
            .then(res => {
                this.setState({ parentDetail: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading parent data');
            })
            .finally(() => {
                this.props.onDoneLoading();
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
        ParentsService.updateParent(parentID, parentDetail);
    }

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ tempPictureFile: event.target.files[0] });
        }
    }

    handleFinishImageCropping = async (newFile) => {
        const { parentID, parentDetail } = this.state;
        this.props.onShowLoading(false, 1);
        // upload a picture and get { reference, url }
        let newPicture;
        try {
            newPicture = await ParentsService.uploadPicture(newFile);
        } catch (err) {
            console.log(err);
            toastr.error('There was an error in uploading a file');
        }
        // push the new picture reference
        if (typeof newPicture !== 'undefined') {
            parentDetail.pictures.push(newPicture);
            ParentsService.updateParent(parentID, parentDetail)
                .then(() => {
                    toastr.success('Upload success');
                })
                .catch(() => {
                    toastr.error('There was an error in uploading a file');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    handleDeletePicture = (index) => {
        const { parentID, parentDetail } = this.state;
        const pictureToDelete = JSON.parse(JSON.stringify(parentDetail.pictures[index]));
        parentDetail.pictures.splice(index, 1);
        ParentsService.deletePicture(pictureToDelete.reference)
            .then(() => {
                delete parentDetail.parentID;
                ParentsService.updateParent(parentID, parentDetail)
                    .then(() => {
                        toastr.success('Successfully deleted the picture');
                        $('#imageDeleteConfModal').modal('hide');
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
        )
    }
}

export default ParentPictureUpdateForm;