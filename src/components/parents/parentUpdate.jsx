import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ParentUpdateSelection from './parentUpdateSelection';
import ParentCreateForm from './parentInitialForm';
import ParentPictureForm from './parentPictureUpdateForm';

class ParentUpdate extends Component {
    state = {
        url: '',
        parentId: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.parentId = props.match.params.parentId;
    }


    handleCancelClicked = () => {
        const { parentId } = this.state;
        this.props.history.push(`/parent/update/${parentId}`);
    }

    render() {
        const url = `${this.state.url}/update`;
        const { parentId } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}/:parentId`} exact render={(props) => <ParentUpdateSelection {...props} url={url} parentId={parentId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/profile/:parentId`} render={(props) => <ParentCreateForm {...props} parentId={parentId} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} onCancelBtnClicked={this.handleCancelClicked} />} />
                <Route path={`${url}/pictures/:parentId`} render={(props) => <ParentPictureForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default ParentUpdate;