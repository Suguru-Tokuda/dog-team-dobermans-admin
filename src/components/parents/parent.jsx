import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
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

    handleBackBtn = () => {
        this.props.history.push('/parents');
    }

    render() {
        const { url } = this.props;
        const { authenticated } = this.props;
            if (authenticated === true) {
                return (
                    <Fragment>
                        <Route path={`${url}/view/:parentID`} render={(props) => <ParentDetail {...props} url={url} showBackBtn={true} onBackBtnClicked={this.handleBackBtn} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                        <Route path={`${url}/create`} render={(props) => <ParentCreate {...props} url={`${url}/create`} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                        <Route path={`${url}/update/:parentID`} render={(props) => <ParentUpdate {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    </Fragment>
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

export default connect(mapStateToProps)(Parent);