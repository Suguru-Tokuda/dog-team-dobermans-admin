import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import waitlistService from '../../services/waitlistService';
import MessageTable from './messageTable';

class MessageList extends Component {

    state = {
        messages: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.showLoading({ reset: true, count: 1 });

        waitlistService.getMessagesGroupedByWaitRequest()
            .then(res => {
                this.setState({
                    messages: res.data
                })
            })
            .catch(err => {
                toastr.error('There was an error in loading messages.')
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    render() {
        const { messages } = this.state;

        if (messages.length > 0) {
            return <MessageTable messages={messages} />;
        } else {
            return null;
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);