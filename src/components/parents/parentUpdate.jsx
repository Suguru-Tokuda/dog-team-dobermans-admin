import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import ParentUpdateSelection from './parentUpdateSelection';
import ParentCreateForm from './parentInitialForm';
import ParentPictureForm from './parentPictureUpdateForm';

class ParentUpdate extends Component {
    state = {
        url: '',
        parentID: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.parentID = props.match.params.parentID;
    }


    handleCancelClicked = () => {
        const { parentID } = this.state;
        this.props.history.push(`/parent/update/${parentID}`);
    }

    render() {
        const url = `${this.state.url}/update`;
        const { parentID } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}/:parentID`} exact render={(props) => <ParentUpdateSelection {...props} url={url} parentID={parentID}  />} />
                <Route path={`${url}/profile/:parentID`} render={(props) => <ParentCreateForm {...props} parentID={parentID} url={url}  onCancelBtnClicked={this.handleCancelClicked} />} />
                <Route path={`${url}/pictures/:parentID`} render={(props) => <ParentPictureForm {...props} url={url}  />} />
            </React.Fragment>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(ParentUpdate);