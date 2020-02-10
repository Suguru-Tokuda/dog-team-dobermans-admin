import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import WaitList from './waitList';
import WaitRequestEditor from './waitRequestEditor';

export default class WaitRequests extends Component {
    render() {        
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path="/wait-list/editor/:waitRequestID" render={(props) => <WaitRequestEditor {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/wait-list/editor" exact render={(props) => <WaitRequestEditor {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/wait-list" exact render={(props) => <WaitList {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}