import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import AboutUsHome from './aboutUsHome';
import MissionStatementsEditor from './missionStatementsEditor';
import OurTeamEditor from './ourTeamEditor';

class AboutUs extends Component {
    state = {
        url: {}
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
                    <Route path={`${url}`} exact render={(props) => <AboutUsHome {...props}  />} />
                    <Route path={`${url}/mission-statements-editor`} exact render={(props) => <MissionStatementsEditor {...props}  />} />
                    <Route path={`${url}/our-teams-editor`} exact render={(props) => <OurTeamEditor {...props}  />} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutUs);