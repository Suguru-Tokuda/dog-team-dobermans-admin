import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PuppyDetail from './puppyDetail';

class PuppyUpdateSelection extends Component {
    state = {
        url: '',
        puppyID: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.puppyID = props.puppyID;
    }

    render() {
        const { puppyID, url } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h4>Update options</h4>
                        <div className="form-inline">
                            <Link className="btn btn-success" to={`${url}/profile/${puppyID}`}>Profile</Link>
                            <Link className="btn btn-primary ml-2" to={`${url}/pictures/${puppyID}`}>Pictures</Link>
                            <Link className="btn btn-secondary ml-2" to="/puppies">Back to Puppy List</Link>
                        </div>
                    </div>
                </div>
                <PuppyDetail 
                    puppyID={puppyID} 
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

export default connect(mapStateToProps, mapDispatchToProps)(PuppyUpdateSelection);