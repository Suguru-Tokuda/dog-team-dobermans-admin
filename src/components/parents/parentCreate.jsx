import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import ParentInitialForm from './parentInitialForm';
import ParentPictureForm from './parentPictureForm';
import ParentConfirmation from './parentConfirmation';

class ParentCreate extends Component {
    state = {
        initialParams: {},
        pictures: []
    };

    handleNextBtnClicked = (initialParams) => {
        this.setState({ initialParams });
    }

    handleConfBtnClicked = (pictures) => {
        this.setState({ pictures });
    }

    handleCancelClicked = () => {
        this.setState({
            initialParams: {},
            pictures: []
        });
        this.props.history.push('/parents');
    }

    render() {
        const { url } = this.props;
        return (
            <React.Fragment>
                <Route path={`${url}/initial-params`} render={(props) => <ParentInitialForm {...props} initialParams={this.state.initialParams}  onToPictureBtnClicked={this.handleNextBtnClicked.bind(this)} onCancelBtnClicked={this.handleCancelClicked} />} />
                <Route path={`${url}/pictures`} render={(props) => <ParentPictureForm {...props} initialParams={this.state.initialParams} pictures={this.state.pictures}  onToConfirmBtnClicked={this.handleConfBtnClicked.bind(this)} />} />
                <Route path={`${url}/confirmation`} render={(props) => <ParentConfirmation {...props} initialParams={this.state.initialParams} pictures={this.state.pictures}  onCancelBtnClicked={this.handleCancelClicked} />} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ParentCreate);