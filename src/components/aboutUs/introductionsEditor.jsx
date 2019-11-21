import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import $ from 'jquery';
import SortableIntroductionRows from './sortableIntroductionsRows';
import PictureCropModal from '../miscellaneous/pictureCropModal';

class IntroductionsEditor extends Component {
    state = {
        introductions: [],
        tempPictureFile: null,
        pictureIndex: -1
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then(res => {
                if (typeof res.data.introductions !== 'undefined') {
                    this.setState({ introductions: res.data.introductions });
                } else {
                    const introductions = [
                        {title: '', description: '', picture: null, validations: {}}
                    ];
                    this.setState({ introductions });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getSubmitBtnLabel = () => {
        const { introductions } = this.state;
        return introductions.length === 0 ? 'Submit' : 'Update';
    }

    getSortableTable = () => {
        const { introductions } = this.state;
        if (introductions.length > 0) {
            const thead = (
                <thead>
                    <tr>
                        <th colSpan="5%"></th>
                        <th colSpan="10%">Title</th>
                        <th colSpan="40%">Description</th>
                        <th colSpan="25%">Picture</th>
                        <th colSpan="10%">Action</th>
                    </tr>
                </thead>
            );
            const tbody = <SortableIntroductionRows 
                            introductions={introductions} 
                            onTitleChanged={this.handleTitleChanged.bind(this)}
                            onDescriptionChanged={this.handleDescriptionChanged.bind(this)}
                            onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                            onImageChanged={this.handleImageChanged.bind(this)}
                            onSortEnd={this.handleSortEnd.bind(this)}
                             />;
            return (
                <div className="table-responsive">
                    <table className="table">
                        {thead}
                        {tbody}
                        {introductions.length <= 4 && (
                            <tbody>
                                <tr key="button" data-id="button">
                                    <td>
                                        <button className="btn btn-success" onClick={this.handleAddBtnClicked}>+</button>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            );
        } else {
            return null;
        }
    }

    handleSortEnd = (introductions) => {
        this.setState({ introductions });
    }

    handleAddBtnClicked = () => {
        const { introductions } = this.state;
        if (introductions.length <= 4) {
            introductions.push({title: '', description: '', picture: null, validations: {}});
            this.setState({ introductions });
        }
    }

    handleUploadBtnClicked() {
        $('#picture-upload').click();
    }

    handleDeleteBtnClicked = (index) => {
        const { introductions } = this.state;
        introductions.splice(index, 1);
        this.setState({ introductions });
    }

    handleImageChanged = (index, event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.setState({
                    tempPictureFile: reader.result
                });
            });
            this.setState({ pictureIndex: index });
            reader.readAsDataURL(event.target.files[0]);
        }
        $('#picture-upload').val(null);
    }
    
    handleFinishImageCropping = (newFile) => {
        const { introductions, pictureIndex } = this.state;
        introductions[pictureIndex].picture = newFile;
        this.setState({
            introductions: introductions,
            pictureIndex: -1
        });
    }

    handleDeletePictureBtnClicked = (index) => {
        const { introductions } = this.state;
        introductions[index].picture = null;
        this.setState({ introductions });
    }

    handleTitleChanged = (index, event) => {
        const { introductions } = this.state;
        const title = event.target.value;
        introductions[index].title = title;
        this.setState({ introductions });
    }

    handleDescriptionChanged = (index, event) => {
        const { introductions } = this.state;
        const description = event.target.value;
        introductions[index].description = description;
        this.setState({ introductions });
    }

    handleSubmitBtnClicked = () => {

    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    render() {
        const { tempPictureFile } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h4>Introductions Editor</h4>
                    </div>
                    <div className="card-body">
                        {this.getSortableTable()}
                    </div>
                    <div className="card-footer">
                        <Link className="btn btn-secondary" to="/about-us">Back</Link>
                        <button type="button" className="btn btn-secondary ml-2">Undo</button>
                        <button type="submit" className="btn btn-primary ml-2" onClick={this.handleSubmitBtnClicked}>{this.getSubmitBtnLabel()}</button>
                    </div>
                </div>
                <PictureCropModal
                    aspect={16/9}
                    pictureFile={tempPictureFile}
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    onResetTempPictureFile={this.handleResetTempPictureFile} />
            </React.Fragment>
        );
    }
}

export default IntroductionsEditor;