import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import $ from 'jquery';
import SortableIntroductionRows from './sortableMissionStatementRows';
import PictureCropModal from '../miscellaneous/pictureCropModal';

class MissionStatementsEditor extends Component {
    state = {
        missionStatements: [],
        originalMissionStatements: [],
        tempPictureFile: null,
        pictureIndex: -1,
        formSubmitted: false
    };

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then(res => {
                if (typeof res.data.missionStatements !== 'undefined') {
                    const missionStatements = res.data.missionStatements.map(missionStatement => { missionStatement.validations = {}; return missionStatement });
                    this.setState({ missionStatements: missionStatements, originalMissionStatements: JSON.parse(JSON.stringify(missionStatements)) });
                } else {
                    const missionStatements = [
                        {title: '', description: '', picture: null, validations: {}}
                    ];
                    this.setState({ missionStatements: missionStatements, originalMissionStatements: JSON.parse(JSON.stringify(missionStatements)) });
                }
            })
            .catch(() => {
                toastr.error('There was an error in loading missionStatements data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getSubmitBtnLabel = () => {
        const { missionStatements } = this.state;
        return missionStatements.length === 0 ? 'Submit' : 'Update';
    }

    getSortableTable = () => {
        const { missionStatements, formSubmitted } = this.state;
        if (missionStatements.length > 0) {
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
                            missionStatements={missionStatements}
                            formSubmitted={formSubmitted}
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
                        {missionStatements.length <= 4 && (
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

    handleSortEnd = (missionStatements) => {
        this.setState({ missionStatements });
    }

    handleAddBtnClicked = () => {
        const { missionStatements } = this.state;
        if (missionStatements.length <= 4) {
            missionStatements.push({title: '', description: '', picture: null, validations: {}});
            this.setState({ missionStatements });
        }
    }

    handleDeleteBtnClicked = (index) => {
        const { missionStatements } = this.state;
        missionStatements.splice(index, 1);
        this.setState({ missionStatements });
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
        const { missionStatements, pictureIndex } = this.state;
        missionStatements[pictureIndex].picture = newFile;
        delete missionStatements[pictureIndex].validations.picture;
        this.setState({
            missionStatements: missionStatements,
            pictureIndex: -1
        });
    }

    handleDeletePictureBtnClicked = (index) => {
        const { missionStatements } = this.state;
        missionStatements[index].picture = null;
        missionStatements[index].validations.picture = 'Select picture';
        this.setState({ missionStatements });
    }

    handleTitleChanged = (index, event) => {
        const { missionStatements } = this.state;
        const title = event.target.value;
        missionStatements[index].title = title;
        if (title.length === 0) {
            missionStatements[index].validations.title = 'Enter title';
        } else {
            delete missionStatements[index].validations.title;
        }
        this.setState({ missionStatements });
    }

    handleDescriptionChanged = (index, event) => {
        const { missionStatements } = this.state;
        const description = event.target.value;
        missionStatements[index].description = description;
        if (description.length === 0) {
            missionStatements[index].validations.description = 'Enter description';
        } else {
            delete missionStatements[index].validations.description;
        }
        this.setState({ missionStatements });
    }

    handleSubmitBtnClicked = async (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let valid = true;
        const { missionStatements } = this.state;
        missionStatements.forEach((missionStatement, i) => {
            if (missionStatement.title === '') {
                missionStatements[i].validations.title = 'Enter title';
                valid = false;
            } else {
                delete missionStatements[i].validations.title;
            }
            if (missionStatement.description === '') {
                missionStatements[i].validations.description = 'Enter description';
                valid = false;
            } else {
                delete missionStatements[i].validations.description;
            }
            if (missionStatement.picture === null) {
                missionStatements[i].validations.picture = 'Select image';
                valid = false;
            } else {
                delete missionStatements[i].validations.picture;
            }
        });
        this.setState({ missionStatements });
        if (valid === true) {
            this.props.onShowLoading(true, 1);
            for (let i = 0, max = missionStatements.length; i < max; i++) {
                const missionStatement = missionStatements[i];
                if (typeof missionStatement.picture.reference === 'undefined') {
                    const picture = await AboutUsService.uploadPicture(missionStatement.picture, 'missionStatements');
                    missionStatements[i].picture = picture;
                }
            }
            // remove pictures that have been removed
            const { originalMissionStatements } = this.state;
            for (let i = 0, max = originalMissionStatements.length; i < max; i++) {
                const missionStatement = originalMissionStatements[i];
                if (missionStatement.picture !== null && typeof missionStatement.picture.reference !== 'undefined') {
                    const targetRef = missionStatement.picture.reference;
                    let toDelete = true;
                    for (let j = 0, maxJ = missionStatements.length; j < maxJ; j++) {
                        if (missionStatements[j].picture.reference === targetRef) {
                            toDelete = false;
                        }
                    }
                    if (toDelete === true) {
                        await AboutUsService.deletePicture(targetRef);
                    }
                }
            }
            let introductionsToSend = JSON.parse(JSON.stringify(missionStatements));
            introductionsToSend = introductionsToSend.map(missionStatement => {
                delete missionStatement.validations;
                return missionStatement;
            });
            AboutUsService.updateIntroductions(introductionsToSend)
                .then(() => {
                    toastr.success('Mission Statements successfully updated');
                    this.props.history.push('/about-us');
                })
                .catch(() => {
                    toastr.error('There was an error in updating missionStatements');
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
        this.setState({ missionStatements: this.state.originalMissionStatements });
    }

    render() {
        const { tempPictureFile } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h4>Mission Statements Editor</h4>
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

export default MissionStatementsEditor;