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
        originalIntroductions: [],
        tempPictureFile: null,
        pictureIndex: -1,
        formSubmitted: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then(res => {
                if (typeof res.data.introductions !== 'undefined') {
                    const introductions = res.data.introductions.map(introduction => { introduction.validations = {}; return introduction });
                    this.setState({ introductions: introductions, originalIntroductions: JSON.parse(JSON.stringify(introductions)) });
                } else {
                    const introductions = [
                        {title: '', description: '', picture: null, validations: {}}
                    ];
                    this.setState({ introductions: introductions, originalIntroductions: JSON.parse(JSON.stringify(introductions)) });
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
        const { introductions, formSubmitted } = this.state;
        if (introductions.length > 0) {
            const thead = (
                <thead>
                    <tr>
                        <th colSpan="10%">Title</th>
                        <th colSpan="40%">Description</th>
                        <th colSpan="5%">Picture</th>
                        <th colSpan="10%">Action</th>
                    </tr>
                </thead>
            );
            const tbody = <SortableIntroductionRows 
                            introductions={introductions}
                            formSubmitted={formSubmitted}
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
                                        <button type="button" className="btn btn-success" onClick={this.handleAddBtnClicked}>+</button>
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
        delete introductions[pictureIndex].validations.picture;
        this.setState({
            introductions: introductions,
            pictureIndex: -1
        });
    }

    handleDeletePictureBtnClicked = (index) => {
        const { introductions } = this.state;
        introductions[index].picture = null;
        introductions[index].validations.picture = 'Select picture';
        this.setState({ introductions });
    }

    handleTitleChanged = (index, event) => {
        const { introductions } = this.state;
        const title = event.target.value;
        introductions[index].title = title;
        if (title.length === 0) {
            introductions[index].validations.title = 'Enter title';
        } else {
            delete introductions[index].validations.title;
        }
        this.setState({ introductions });
    }

    handleDescriptionChanged = (index, event) => {
        const { introductions } = this.state;
        const description = event.target.value;
        introductions[index].description = description;
        if (description.length === 0) {
            introductions[index].validations.description = 'Enter description';
        } else {
            delete introductions[index].validations.description;
        }
        this.setState({ introductions });
    }

    handleSubmitBtnClicked = async (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let valid = true;
        const { introductions } = this.state;
        introductions.forEach((introduction, i) => {
            if (introduction.title === '') {
                introductions[i].validations.title = 'Enter title';
                valid = false;
            } else {
                delete introductions[i].validations.title;
            }
            if (introduction.description === '') {
                introductions[i].validations.description = 'Enter description';
                valid = false;
            } else {
                delete introductions[i].validations.description;
            }
            if (introduction.picture === null) {
                introductions[i].validations.picture = 'Select image';
                valid = false;
            } else {
                delete introductions[i].validations.picture;
            }
        });
        this.setState({ introductions });
        if (valid === true) {
            this.props.onShowLoading(true, 1);
            const introductionsToSend = JSON.parse(JSON.stringify(introductions));
            for (let i = 0, max = introductionsToSend.length; i < max; i++) {
                const introduction = introductionsToSend[i];
                if (typeof introduction.picture.reference === 'undefined') {
                    const picture = await AboutUsService.uploadPicture(introduction.picture, 'introductions');
                    introductionsToSend[i].picture = picture;
                }
                delete introductionsToSend[i].validations;
            }
            AboutUsService.updateIntroductions(introductionsToSend)
                .then(() => {
                    toastr.success('Introductions successfully updated');
                })
                .catch(() => {
                    toastr.error('There was an error in updating introductions');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                })
        }
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    handleUndo = () => {
        this.setState({ introductions: this.state.originalIntroductions });
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
                        <form noValidate>
                            {this.getSortableTable()}
                        </form>
                    </div>
                    <div className="card-footer">
                        <Link className="btn btn-secondary" to="/about-us">Back</Link>
                        <button type="button" className="btn btn-secondary ml-2" onClick={this.handleUndo}>Undo</button>
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