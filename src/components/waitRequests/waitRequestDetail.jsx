import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import WaitRequestMessenger from './waitRequestMessenger';
import WaitRequestMessage from './waitRequestMessage';
import ConstantsService from '../../services/constantsService';
import WaitlistService from '../../services/waitlistService';
import toastr from 'toastr';

class WaitRequestDetail extends Component {
    state = {
        waitRequestID: undefined,
        waitRequest: {},
        messages: []
    };

    constructor(props) {
        super(props);

        this.state.waitRequestID = props.match.params.waitRequestID;
        const { waitRequestID } = this.state;

        if (waitRequestID && waitRequestID !== 'editor') {
            this.props.showLoading({ reset: true, count: 1 });
    
            Promise.all([
                WaitlistService.getWaitRequest(waitRequestID),
                WaitlistService.getWaitRequestMessages(waitRequestID)
            ])
            .then(async res => {
    
                const waitRequest = res[0].data;
                const messages = res[1].data;
    
                this.state.waitRequest = waitRequest;
                this.state.messages = messages;
    
                if (messages.length > 0) {
                    const messageIDsMarkAsRead = [];
    
                    messages.forEach(message => {
                        if (message.recipientID === ConstantsService.getBreederID() && !message.read)
                            messageIDsMarkAsRead.push(message.messageID)
                    });
                            
                    if (messageIDsMarkAsRead.length > 0) {
                        try {
                            await WaitlistService.markMessageAsRead(messageIDsMarkAsRead);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                toastr.error('There was an error on loading wait request data')
            })
            .finally(() => {
                this.props.doneLoading({ reset: false });
            });
        }
    }

    renderRequestDetail = () => {
        const { waitRequest } = this.state;

        if (waitRequest && Object.keys(waitRequest).length > 0) {
            return (
                <React.Fragment>
                    <div className="card">
                        <div className="card-header">
                            <h2>Request Summary</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Request Receive</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.created }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">UserID</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.userID }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">First Name</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.firstName }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Last Name</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.lastName }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Email</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.email }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Phone</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.phone }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">City, State</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.city }, { waitRequest.state }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Request Message</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.message }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Color Preference</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { waitRequest.color }
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }

    renderExistingMessages = () => {
        const { messages } = this.state;

        if (messages.length > 0) {
            return messages.map(message => {
                return <WaitRequestMessage {...this.props} 
                                           key={message.messageID} 
                                           message={message} 
                                           waitRequest={this.state.waitRequest}
                        />;
            });
        }
    }

    onMessageSent = (newMessage) => {
        let { messages } = this.state;

        messages.push(newMessage);

        messages = messages.sort((messageA, messageB) => {
            return messageA.sentDate > messageB.sentDate ? -1 : messageA.sentDate < messageB.sentDate ? 1 : 0;
        });

        this.setState({ messages });
    }


    render() {
        const { waitRequestID, waitRequest } = this.state;
        const { userID } = waitRequest;
        let prevPathname;

        if (this.props.location.state && this.props.location.state) {
            prevPathname = this.props.location.state;
        }

        if (waitRequestID && waitRequestID !== 'editor') {
            return (
                <div className="container">
                    { this.renderRequestDetail() }
                    <div className="row">
                        <div className="col-12">
                            <Link className="btn btn-primary" to={prevPathname ? prevPathname : '/wait-list' }>Back</Link>
                        </div>
                    </div>
                    <WaitRequestMessenger {...this.props} 
                                          waitRequestID={waitRequestID} 
                                          userID={userID}
                                          onMessageSent={this.onMessageSent.bind(this)}
                    />
                    { this.renderExistingMessages() }
                </div>
            );
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

export default connect(mapStateToProps, mapDispatchToProps)(WaitRequestDetail);