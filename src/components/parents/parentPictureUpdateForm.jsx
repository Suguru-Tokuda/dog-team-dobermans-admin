import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentsService from '../../services/parentsService';
import SortablePictureList from '../miscellaneous/sortablePictureList';
import toastr from 'toastr';
import PictureCropModal from '../miscellaneous/pictureCropModal';

class ParentPictureUpdateForm extends Component {
    state = {
        parentID: '',
        tempPictureFile: null,
        tempPictureFileName: '',
        parentDetail: {}
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
                                onDeletePictureBtnClicked={this.handleDeletePicture.bind(this)}
                                />;
            }
        }
        if (pictures.length <= 4) {
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
            <React.Fragment>
                {pictureCards}
                {pictureAddCard}
            </React.Fragment>
        );
    }

    handleUpdatePictureOrder = (pictures) => {
        const { parentID, parentDetail } = this.state;
        parentDetail.pictures = pictures;
        ParentsService.updateParent(parentID, parentDetail);
    }

    handleImageChange = async (event) => {
        if (event.target.files & event.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.setState({
                    tempPictureFile: reader.result
                });
            });
            this.setState({ tempPictureFileName: event.target.files[0].name });
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    handleFinishImageCropping = async (newFile) => {
        const { parentID, parentDetail } = this.state;
        this.props.onShowLoading(true, 1);
        // upload a picture and get { reference, url }
        const newPicture = await ParentsService.uploadPicture(newFile);
        // push the new picture reference
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

    handleDeletePicture = async (index) => {
        const { parentID, parentDetail } = this.state;
        const pictureToDelete = parentDetail.pictures[index];
        parentDetail.pictures.splice(index, 1);
        ParentsService.deletePicture(pictureToDelete.reference)
            .then(() => {
                ParentsService.updateParents(parentID, parentDetail)
                    .then(() => {
                        toastr.success('Successfully deleted the picture');
                        this.setState({ parentDetail });
                    })
                    .catch(() => {
                        toastr.error('There was an error in deleting a picture');
                    });
            })
            .catch(() => {
                toastr.error('There was an error in deleting a picture');
            })
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    render() {
        const { tempPictureFile, parentID } = this.state;
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
                        <Link className="btn btn-sm btn-secondary" to={`/parent/update/${parentID}`}>Back</Link>
                    </div>
                </div>
                <PictureCropModal 
                    pictureFile={tempPictureFile} 
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    onResetTempPictureFile={this.handleResetTempPictureFile}
                />
            </React.Fragment>
        )
    }
}

export default ParentPictureUpdateForm;