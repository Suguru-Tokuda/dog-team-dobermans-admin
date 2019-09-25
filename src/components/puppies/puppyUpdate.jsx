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

    componentDidMount() {
        console.log(this.props.match.params.puppyId);
    }

    render() {
        return (
            <React.Fragment>
                <Route path={`${this.props.url}`} exact render={() => <PuppyUpdateSelection puppyId={this.state.puppyId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${this.props.url}/profile`} render={() => <PuppyCreateForm puppyId={this.state.puppyId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${this.props.url}/picture`} render={() => <PuppyPictureUpdateForm puppyId={this.state.puppyId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdate;