import React, { Component } from 'react';
import WaitRequestMessenger from './waitRequestMessenger';
import WaitRequestMessage from './waitRequestMessage';
import WaitListService from '../../services/waitListService';

class WaitRequestDetail extends Component {
    state = {
        waitRequestID: undefined,
        waitRequest: {},
        messages: []
    };

    constructor(props) {
        super(props);

        this.state.waitRequestID = props.match.params.waitRequestID;

        this.props.onShowLoading(true, 1);

        WaitListService.getWaitRequest(this.state.waitRequestID)
            .then(res => {
                this.setState({ waitRequest: res.data });
            })
            .catch(err => {

            })
            .finally(() => {
                this.props.onDoneLoading();
            });

        // API call to get the puppy request details and messages associated to the ID.
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
                return <WaitRequestMessage message={message} />;
            });
        }
    }


    render() {
        const { waitRequestID } = this.state;

        return (
            <div className="container">
                { this.renderRequestDetail() }
                <WaitRequestMessenger {...this.props} waitRequestID={waitRequestID} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                { this.renderExistingMessages() }
            </div>
        );
    }
}

export default WaitRequestDetail;