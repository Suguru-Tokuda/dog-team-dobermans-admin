import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import BlogList from './blogList';
import BlogEditor from './blogEditor';

class Blog extends Component {

    render() {
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path="/blog/view/:blogID" render={(props) => <BlogEditor {...props}  />} />
                    <Route path="/blog/create" render={(props) => <BlogEditor {...props}  />} />
                    <Route path="/blog/update/:blogID" render={(props) => <BlogEditor {...props}  />} />
                    <Route path="/blog/delete/:blogID" render={(props) => <BlogEditor {...props}  />} />
                    <Route path="/blog" exact render={(props) => <BlogList {...props}  />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/" />;
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

export default connect(mapStateToProps, mapDispatchToProps)(Blog);