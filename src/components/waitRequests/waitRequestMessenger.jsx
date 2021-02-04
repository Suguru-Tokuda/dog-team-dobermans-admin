import React, { Component } from 'react';
import { connect } from 'react-redux';
import waitListService from '../../services/waitListService';
import toastr from 'toastr';

class WaitRequestMessenger extends Component {
    state = {
        waitRequestID: '',
        userID: '',
        messageBody: ''
    };

    constructor(props) {
        super(props);

        this.state.waitRequestID = props.waitRequestID;
        if (props.userID)
            this.state.userID = props.userID;
    }

    componentDidUpdate() {
        if (this.props.userID !== this.state.userID) {
            this.setState({ userID: this.props.userID });
        }
    }

    handleSendMessageClicked = () => {
        const { messageBody, waitRequestID, userID } = this.state;

        if (messageBody && waitRequestID && userID) {
            this.props.showLoading({ reset: false, count: 1 });

            waitListService.sendWaitRequestMessage(undefined, userID, waitRequestID, messageBody)
                .then(res => {
                    this.props.onMessageSent(res.data);

                    this.setState({ messageBody: '' });
                })
                .catch(err => {
                    toastr.error('There was an error in sending a message.');
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                })
        }
    }

    renderTextEditor = () => {
        const { messageBody } = this.state;

        return (
            <div style={{ padding: '20px' }}>
                <div className="row">
                    <div className="col-12">
                        <h2 className="ml-2 mt-2">New Message</h2>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-12">
                        <div>
                            <textarea 
                                className="form-control"
                                rows="10"
                                style={{ resize: 'none' }}
                                value={ messageBody }
                                onChange={ e => {
                                    let messageBody = e.target.value;

                                    if (messageBody.length > 1000)
                                        messageBody = messageBody.substring(0, 1000);

                                    this.setState({ messageBody: messageBody })
                                }}></textarea>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        { messageBody.length } / 1000
                    </div>
                    <div className="col-6">
                        <div className="pull-right">
                            <button 
                                className="btn btn-primary"
                                onClick={this.handleSendMessageClicked}
                                ><i className="fa fa-send"></i> Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderTextEditor();
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

export default connect(mapStateToProps, mapDispatchToProps)(WaitRequestMessenger);