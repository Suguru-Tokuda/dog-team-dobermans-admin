import React, { Component } from 'react';
import PuppiesService from '../../services/puppiesService';
import SortablePictureLlist from './sortablePictureList';
import toastr from 'toastr';

class PuppyPictureUpdateForm extends Component {
    state = {
        puppyId: '',
        puppyData: {}
    };

    constructor(props) {
        super(props);
        this.state.puppyId = props.match.params.puppyId;
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        PuppiesService.getPuppy(this.state.puppyId)
            .then(res => {
                console.log(res);
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
            )
        }
        return (
            <div className="row">
                {pictureCards}
                {pictureAddCard}
            </div>
        );
    }

    handleUpdatePictureOrder = (pictures) => {
        const puppyData = this.state.puppyData;
        puppyData.pictures = pictures;
        PuppiesService.updatePuppy(this.state.puppyId, puppyData);
    }

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            this.props.onShowLoading(true, 1);
            // upload a picture and get {reference, url}
            const newPicture = await PuppiesService.uploadPicture(event.target.files[0]);
            const puppyData = this.state.puppyData;
            // push the new picture reference
            puppyData.pictures.push(newPicture);
            PuppiesService.updatePuppy(this.state.puppyId, puppyData)
                .then(res => {
                    toastr.success("Upload success");
                })
                .catch(err => {
                    toastr.error('There was an error in uploading file');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    handleDeletePicture = async (index) => {
        const pictures = this.state.puppyData.pictures;
        const puppyData = this.state.puppyData;
        const pictureToDelete = pictures[index];
        pictures.splice(index, 1);
        puppyData.pictures = pictures;
        PuppiesService.deletePicture(pictureToDelete.reference)
            .then(res => {
                PuppiesService.updatePuppy(this.state.puppyId, puppyData)
                    .then(res => {
                        toastr.success('Successfully deleted the picture');
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

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h1>Pictures</h1>
                    <div className="row form-group">
                        {this.getPictures()}
                    </div>
                </div>
            </div>
        );
    }
}

export default PuppyPictureUpdateForm;