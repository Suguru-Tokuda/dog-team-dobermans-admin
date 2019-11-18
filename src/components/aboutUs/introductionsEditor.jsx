import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import { Link } from 'react-router-dom';
import SortableIntroductionTableRows from './sortableIntoructionTableRows';
import toastr from 'toastr';
import $ from 'jquery';

class IntroductionsEditor extends Component {
    state = {
        introductions: []
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
                        {title: '', description: '', picture: null, validations: {} }
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
            const tbody = (
                <tbody>
                    <SortableIntroductionTableRows 
                        introductions={introductions}
                        onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                        onDeletePictureBtnClicked={this.handleDeletePictureBtnClicked.bind(this)}
                        onImageChanged={this.handleImageChanged.bind(this)}
                        uploadBtnClicked={this.handleUploadBtnClicked}
                        onTitleChanged={this.handleTitleChanged.bind(this)}
                        onDescriptionChanged={this.handleDescriptionChanged.bind(this)}
                         />
                </tbody>
            );
            return (
                <div className="table-responsive">
                    <table className="table">
                        {thead}
                        {tbody}
                    </table>
                </div>
            );
        } else {
            return null;
        }
    }

    handleUploadBtnClicked() {
        $('#picture-upload').click();
    }

    handleDeleteBtnClicked = (index) => {
        console.log(index);
    }

    handleDeletePictureBtnClicked = (index) => {

    }

    handleImageChanged = (index, event) => {
        console.log(index);
        console.log(event);
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

    render() {
        return (
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
        );
    }
}

export default IntroductionsEditor;