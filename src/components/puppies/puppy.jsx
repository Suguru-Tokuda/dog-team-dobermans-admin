import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PuppyDetail from './puppyDetail';
import PuppyCreate from './puppyCreate';
import PuppyUpdate from './puppyUpdate';
import PuppySalesForm from './puppySalesForm';
import PuppyMessageEditor from './puppyMessageEditor';

class Puppy extends Component {
    state = {
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    render() {
        const { url } = this.state;
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path={`${url}/view/:puppyID`} render={(props) => <PuppyDetail {...props}  />} />
                    <Route path={`${url}/create`} render={(props) => <PuppyCreate {...props} url={`${url}/create`}  />} />
                    <Route path={`${url}/update/:puppyID`} render={(props) => <PuppyUpdate {...props} url={url}  />} />
                    <Route path={`${url}/sales/:puppyID`} render={(props) => <PuppySalesForm {...props} url={url}  />} />
                    <Route path={`${url}/puppy-message`} render={(props) => <PuppyMessageEditor {...props}  />} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Puppy);