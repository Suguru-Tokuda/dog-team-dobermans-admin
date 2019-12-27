import React, { Component } from 'react';
import AboutDobermansEditorModal from './aboutDobermansEditorModal';
import AboutDobermanService from '../../services/aboutDobermanService';
import toastr from 'toastr';
import $ from 'jquery';

class AboutDobermans extends Component {
    state = {
        aboutDobermans: '',
        isEditing: false
    };

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutDobermanService.getAboutDobermans()
            .then(res => {
                this.setState({ aboutDobermans: res.data })
            })
            .catch(() => {
                toastr.error('There was an error in loading about dobermans data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleEditBtnClicked = () => {
        $('#aboutDobermansEditorModal').modal('show');
    }

    render() {
        const { aboutDobermans } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h3>About Dobermans</h3>
                    </div>
                    <div className="card-body">
                        <div dangerouslySetInnerHTML={{ __html: aboutDobermans }} />
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={this.handleEditBtnClicked}>Edit</button>
                    </div>
                </div>
                <AboutDobermansEditorModal {...this.props} body={aboutDobermans} onUpdateData={this.handleUpdateData} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
            </React.Fragment>
        )
    }

}

export default AboutDobermans;