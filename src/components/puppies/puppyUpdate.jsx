import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyUpdateSelection from './puppyUpdateSelection';
import PuppyCreateForm from './puppyInitialForm';
import PuppyPictureUpdateForm from './puppyPictureUpdateForm';

class PuppyUpdate extends Component {
    state = {
        url: '',
        puppyId: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.puppyId = props.match.params.puppyId;
    }

    render() {
        const url = `${this.state.url}/update`;
        return (
            <React.Fragment>
                <Route path={`${url}/:puppyId`} exact render={(props) => <PuppyUpdateSelection {...props} url={url} puppyId={this.state.puppyId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/profile/:puppyId`} render={(props) => <PuppyCreateForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/pictures/:puppyId`} render={(props) => <PuppyPictureUpdateForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdate;