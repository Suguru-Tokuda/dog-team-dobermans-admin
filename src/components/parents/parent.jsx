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
                        <Route path={`${url}/view/:parentID`} render={(props) => <ParentDetail {...props} url={url} showBackBtn={true} onBackBtnClicked={this.handleBackBtn}  />} />
                        <Route path={`${url}/create`} render={(props) => <ParentCreate {...props} url={`${url}/create`}  />} />
                        <Route path={`${url}/update/:parentID`} render={(props) => <ParentUpdate {...props} url={url}  />} />
                    </Fragment>
                );
            } else {
                return <Redirect to="/login" />;
            }
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Parent);