import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ParentUpdateSelection from './parentUpdateSelection';
import ParentCreateForm from './parentInitialForm';
import ParentPictureForm from './parentPictureUpdateForm';

class ParentUpdate extends Component {
    state = {
        url: '',
        parentID: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.parentID = props.match.params.parentID;
    }


    handleCancelClicked = () => {
        const { parentID } = this.state;
        this.props.history.push(`/parent/update/${parentID}`);
    }

    render() {
        const url = `${this.state.url}/update`;
        const { parentID } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}/:parentID`} exact render={(props) => <ParentUpdateSelection {...props} url={url} parentID={parentID} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/profile/:parentID`} render={(props) => <ParentCreateForm {...props} parentID={parentID} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} onCancelBtnClicked={this.handleCancelClicked} />} />
                <Route path={`${url}/pictures/:parentID`} render={(props) => <ParentPictureForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default ParentUpdate;