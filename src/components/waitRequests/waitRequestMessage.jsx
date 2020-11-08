import React, { Component } from 'react';

class WaitRequestMessage extends Component {

    state = {
        message: {}
    };

    constructor(props) {
        super(props);

        this.state.message = props.message;
    }

    render() {
        const { message } = this.state;

        return (
            <div style={{ padding: '20px' }}>
                <div className="row">
                    <div class="col-6">
                        From: { message.senderName }
                    </div>
                    <div class="col-6">
                        <div class="float-right">
                            { message.postDate.toString() }
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
                            readonly>
                        </textarea>
                    </div>
                </div>
            </div>
        )
    };
}

export default WaitRequestMessage;