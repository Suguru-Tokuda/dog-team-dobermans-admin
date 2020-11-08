import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import WaitList from './waitList';
import WaitRequestEditor from './waitRequestEditor';
import WaitRequestDetail from './waitRequestDetail';

class WaitRequests extends Component {
    render() {        
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path="/wait-list/editor/:waitRequestID" render={(props) => <WaitRequestEditor {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/wait-list/:waitRequestID" exact render={(props) => <WaitRequestDetail {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/wait-list/editor" exact render={(props) => <WaitRequestEditor {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/wait-list" exact render={(props) => <WaitList {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});

export default connect(mapStateToProps)(WaitRequests);