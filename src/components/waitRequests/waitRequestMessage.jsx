import React, { Component } from 'react';
import ConstantsService from '../../services/constantsService';
import moment from 'moment';

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
                        <textarea
                            className="form-control"
                            value={ message.messageBody }
                            rows="7"
                            style={{ resize: 'none' }}
                            readOnly>
                        </textarea>
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