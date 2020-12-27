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
                    <Route path="/wait-list/editor/:waitRequestID" render={(props) => <WaitRequestEditor {...props} authenticated={authenticated}  />} />
                    <Route path="/wait-list/:waitRequestID" exact render={(props) => <WaitRequestDetail {...props} authenticated={authenticated}  />} />
                    <Route path="/wait-list/editor" exact render={(props) => <WaitRequestEditor {...props} authenticated={authenticated}  />} />
                    <Route path="/wait-list" exact render={(props) => <WaitList {...props} authenticated={authenticated}  />} />
                </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(WaitRequests);