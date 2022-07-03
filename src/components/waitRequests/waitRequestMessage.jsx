import React, { Component } from 'react';
import ConstantsService from '../../services/constantsService';
import moment from 'moment';
import $ from 'jquery';

class WaitRequestMessage extends Component {

    state = {
        message: {}
    };

    constructor(props) {
        super(props);

        this.state.message = props.message;
        this.state.waitRequest = props.waitRequest;
    }

    render() {
        const { message } = this.state;
        message.messageBody = $('<textarea />').html(message.messageBody).text();

        return (
            <div style={{ padding: '20px' }}>
                <div className="row">
                    <div className="col-6">
                        {message.senderID === this.state.waitRequest.userID && (
                            <span>From: { this.state.waitRequest.firstName } {this.state.waitRequest.lastName }</span>
                        )}
                        {message.senderID === ConstantsService.getBreederID() && (
                            <span>From: Bob Johnson</span>
                        )}
                    </div>
                    <div className="col-6">
                        <div className="float-right">
                            { moment(new Date(message.sentDate.toString())).format('MM/DD/YYYY hh:mm:ss') }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div style={{ border: '0.5px solid black' }}>
                            <div style={{ padding: '10px' }}>
                                <div dangerouslySetInnerHTML={{ __html: message.messageBody }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div className="col-12">
                        <div className="float-right">
                            {(message.senderID === ConstantsService.getBreederID() && message.read) && (
                                <span className="text-muted">Read</span>
                            )}
                            {(message.senderID === ConstantsService.getBreederID() && !message.read) && (
                                <span className="text-muted">Sent</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default WaitRequestMessage;