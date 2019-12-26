import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SortablePictureList from '../miscellaneous/sortablePictureList';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';
import PictureCropModal from '../miscellaneous/pictureCropModal';
import ParentsService from '../../services/parentsService';

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
        const { aboutUsID, aboutUsDetail } = this.state;
        aboutUsDetail.pictures = pictures;
        AboutUsService.updateAboutUs(aboutUsID, aboutUsDetail);
    }

    handleFinishImageCroppping = async (newFile) => {
        const { aboutUsID, aboutUsDetail } = this.state;
        this.props.onShowLoading(true, 1);
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
                this.props.onDoneLoading();
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
                <PictureCropModal
                    aspect={16/9}
                    pictureFile={tempPictureFile}
                    onFinishImageCropping={this.handleFinishImageCroppping.bind(this)}
                    onResetTempPictureFile={this.handleResetTempPictureFile}
                />
            </React.Fragment>
        )
    }


}

export default AboutUsPictureForm;