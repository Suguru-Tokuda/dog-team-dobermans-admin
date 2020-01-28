import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';
import $ from 'jquery';
import SortableOurTeamRows from './sortableOurTeamRows';
import ImageCropModal from '../miscellaneous/imageCropModal';

class OurTeamEditor extends Component {
    state = {
        ourTeam: [],
        originalOurTeam: [],
        tempPictureFile: null,
        pictureIndex: -1,
        formSubmitted: false
    };
    
    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then(res => {
                let ourTeam;
                if (typeof res.data.ourTeam !== 'undefined') {
                    if (res.data.ourTeam.length > 0) {
                        ourTeam = res.data.ourTeam.map(member => { member.validations = {}; return member });
                        this.setState({ ourTeam: ourTeam, originalOurTeam: JSON.parse(JSON.stringify(ourTeam) )});
                    } else {
                        ourTeam = [
                            {name: '', title: '', description: '', picture: null, validations: {}}
                        ];
                    }
                } else {
                    ourTeam = [
                        {name: '', title: '', description: '', picture: null, validations: {}}
                    ];    
                }
                this.setState({ ourTeam: ourTeam, originalOurTeam: JSON.parse(JSON.stringify(ourTeam) )});
            })
            .catch(() => {
                toastr.error('There was an error in loading our team data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getSubmitBtnLabel = () => {
        const { ourTeam } = this.state;
        return ourTeam.length === 0 ? 'Submit' : 'Update';
    }

    getSortableTable = () => {
        const { ourTeam, formSubmitted } = this.state;
        if (ourTeam.length > 0) {
            const thead = (
                <thead>
                    <tr>
                        <th colSpan="15%">Name</th>
                        <th colSpan="15%">Title</th>
                        <th colSpan="40%">Description</th>
                        <th colSpan="20%">Picture</th>
                        <th colSpan="10%">Action</th>
                    </tr>
                </thead>
            );
            const tbody = <SortableOurTeamRows
                            ourTeam={ourTeam}
                            formSubmitted={formSubmitted}
                            onNameChanged={this.handleNameChanged.bind(this)}
                            onTitleChanged={this.handleTitleChanged.bind(this)}
                            onDescriptionChanged={this.handleDescriptionChanged.bind(this)}
                            onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                            onDeletePictureBtnClicked={this.handleDeletePictureBtnClicked.bind(this)}
                            onImageChanged={this.handleImageChanged.bind(this)}
                            onSortEnd={this.handleSortEnd.bind(this)}
                            />;
            return (
                <div className="table-responsive">
                    <table className="table">
                        {thead}
                        {tbody}
                        {ourTeam.length <= 4 && (
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

    handleSortEnd = (ourTeam) => {
        this.setState({ ourTeam });
    }

    handleAddBtnClicked = () => {
        const { ourTeam } = this.state;
        if (ourTeam.length <= 4) {
            ourTeam.push({name: '', title: '', description: '', picture: null, validations: {}});
            this.setState({ ourTeam });
        }
    }

    handleDeleteBtnClicked = (index) => {
        const { ourTeam } = this.state;
        ourTeam.splice(index, 1);
        this.setState({ ourTeam });
    }

    handleImageChanged = (index, event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ 
                tempPictureFile: event.target.files[0],
                pictureIndex: index
            });
        }
        $('#picture-upload').val(null);
    }

    handleFinishImageCropping = (newFile) => {
        const { ourTeam, pictureIndex } = this.state;
        ourTeam[pictureIndex].picture = newFile;
        delete ourTeam[pictureIndex].validations.picture;
        this.setState({
            ourTeam: ourTeam,
            pictureIndex: -1
        });
    }

    handleDeletePictureBtnClicked = (index) => {
        const { ourTeam } = this.state;
        ourTeam[index].picture = null;
        ourTeam[index].validations.picture = 'Select picture';
        this.setState({ ourTeam });
    }

    handleNameChanged = (index, event) => {
        const { ourTeam } = this.state;
        const name = event.target.value;
        ourTeam[index].name = name;
        if (name.length === 0) {
            ourTeam[index].validations.name = 'Enter name';
        } else {
            delete ourTeam[index].validations.name;
        }
        this.setState({ ourTeam });
    }

    handleTitleChanged = (index, event) => {
        const { ourTeam } = this.state;
        const title = event.target.value;
        ourTeam[index].title = title;
        if (title.length === 0) {
            ourTeam[index].validations.title = 'Enter title';
        } else {
            delete ourTeam[index].validations.title;
        }
        this.setState({ ourTeam });
    }

    handleDescriptionChanged = (index, event) => {
        const { ourTeam } = this.state;
        const description = event.target.value;
        ourTeam[index].description = description;
        if (description.length === 0) {
            ourTeam[index].validations.description = 'Enter description';
        } else {
            delete ourTeam[index].validations.description;
        }
        this.setState({ ourTeam });
    }

    handleSubmitBtnClicked = async (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let valid = true;
        const { ourTeam } = this.state;
        ourTeam.forEach((member, i) => {
            if (member.name === '') {
                ourTeam[i].validations.name = 'Enter name';
                valid = false;
            } else {
                delete ourTeam[i].validations.name;
            }
            if (member.title === '') {
                ourTeam[i].validations.title = 'Enter title';
                valid = false;
            } else {
                delete ourTeam[i].validations.title;
            }
            if (member.description === '') {
                ourTeam[i].validations.description = 'Enter description';
                valid = false;
            } else {
                delete ourTeam[i].validations.description;
            }
            if (member.picture === null) {
                ourTeam[i].validations.picture = 'Select picture';
                valid = false;
            } else {
                delete ourTeam[i].validations.picture;
            }
        });
        this.setState({ ourTeam });
        if (valid === true) {
            this.props.onShowLoading(true, 1);
            for (let i = 0, max = ourTeam.length; i < max; i++) {
                const member = ourTeam[i];
                if (typeof member.picture.reference === 'undefined') {
                    const picture = await AboutUsService.uploadPicture(member.picture, 'ourTeam');
                    ourTeam[i].picture = picture;
                }
            }
            // remove picture that have been removed
            const { originalOurTeam } = this.state;
            for (let i = 0, max = originalOurTeam.length; i < max; i++) {
                const member = originalOurTeam[i];
                if (member.picture !== null && typeof member.picture.reference !== 'undefined') {
                    const targetRef = member.picture.reference;
                    let toDelete = true;
                    for (let j = 0, maxJ = ourTeam.length; j < maxJ; j++) {
                        if (ourTeam[j].picture.reference === targetRef) {
                            toDelete = false;
                        }
                    }
                    if (toDelete === true) {
                        await AboutUsService.deletePicture(targetRef);
                    }
                }
            }
            let ourTeamToSend = JSON.parse(JSON.stringify(ourTeam));
            ourTeamToSend = ourTeamToSend.map(member => {
                delete member.validations;
                return member;
            });
            AboutUsService.updateOurTeam(ourTeamToSend)
                .then(() => {
                    toastr.success('Our team successfully updated');
                    this.props.history.push('/about-us');
                })
                .catch(() => {
                    toastr.error('There was an error in updating our team');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    handleUndo = () => {
        this.setState({ ourTeam: this.state.originalOurTeam });
    }

    render() {
        const { tempPictureFile } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h4>Our Teams Editor</h4>
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
                <ImageCropModal
                    imageFile={tempPictureFile}
                    onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
                    handleResetTempPictureFile={this.handleResetTempPictureFile}
                    onShowLoading={this.props.onShowLoading.bind(this)} 
                    onDoneLoading={this.props.onDoneLoading.bind(this)}
                    aspectRatio={1}
                />
            </React.Fragment>
        );
    }
}

export default OurTeamEditor;