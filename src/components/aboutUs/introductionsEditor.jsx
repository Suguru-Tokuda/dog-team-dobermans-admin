import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import { Link } from 'react-router-dom';
import SortableIntroductionTableRows from './sortableIntoructionTableRows';
import toastr from 'toastr';

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
        const thead = (
            <thead>
                <tr>
                    <th colSpan="5%"></th>
                    <th colSpan="20%">Title</th>
                    <th colSpan="50%">Description</th>
                    <th colSpan="25%">Picture</th>
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
                    onTitleChanged={this.handleTitleChanged.bind(this)}
                    onDescriptionChanged={this.handleDescriptionChanged.bind(this)}
                     />
            </tbody>
        );
    }

    handleDeleteBtnClicked = (index) => {

    }

    handleDeletePictureBtnClicked = (index) => {

    }

    handleImageChanged = (event, index) => {

    }

    handleTitleChanged = (event, index) => {
        const title = event.target.value;
    }

    handleDescriptionChanged = (event, index) => {
        const description = event.target.value;
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
                    {this.getSortableTable}
                </div>
                <div className="card-footer">
                    <Link className="btn btn-secondary" to="/about-us">Back</Link>
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmitBtnClicked}>{this.getSubmitBtnLabel()}</button>
                </div>
            </div>
        );
    }
}

export default IntroductionsEditor;