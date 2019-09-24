import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import ParentDetail from './parentDetail';
import ParentCreate from './parentCreate';
import ParentUpdate from './parentUpdate';

class Parent extends Component {
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
            <Fragment>
                <Route path={`${url}/view/:id`} render={(props) => <ParentDetail {...props} onShowLoading={this.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/create`} render={(props) => <ParentCreate {...props} onShowLoading={this.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/update/:id`} render={(props) => <ParentUpdate {...props} onShowLoading={this.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </Fragment>
        );
    }
}

export default Parent;