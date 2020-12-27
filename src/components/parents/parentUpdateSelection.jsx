import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ParentDetail from './parentDetail';

class ParentUpdateSelection extends Component {
    state = {
        url: '',
        parentID: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.parentID = props.match.params.parentID;
    }

    render() {
        const { parentID, url } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h4>Update options</h4>
                        <div className="form-inline">
                            <Link className="btn btn-success" to={`${url}/profile/${parentID}`}>Profile</Link>
                            <Link className="btn btn-primary ml-2" to={`${url}/pictures/${parentID}`}>Pictures</Link>
                            <Link className="btn btn-secondary ml-2" to="/parents">Back to Parent List</Link>
                        </div>
                    </div>
                </div>
                <ParentDetail
                    parentID={parentID}
                    hideButtons={true} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ParentUpdateSelection);