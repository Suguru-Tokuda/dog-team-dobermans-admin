import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyDetail from './puppyDetail';
import PuppyCreate from './puppyCreate';
import PuppyUpdate from './puppyUpdate';

class Puppy extends Component {
    state = {
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    render() {
        const url = this.props.url;
        return (
            <React.Fragment>
                <Route path={`${url}/view/:puppyId`} render={(props) => <PuppyDetail {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/create`} render={(props) => <PuppyCreate {...props} url={`${url}/create`} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/update/:puppyId`} render={(props) => <PuppyUpdate {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        )
    }
}

export default Puppy;