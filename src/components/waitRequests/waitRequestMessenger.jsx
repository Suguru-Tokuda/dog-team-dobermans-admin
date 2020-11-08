import React, { Component } from 'react';

class WaitRequestMessenger extends Component {
    state = {
        waitRequestID: 0,
        messageBody: ''
    };

    constructor(props) {
        super(props);

        this.state.waitRequestID = props.waitRequestID;
    }

    handleSendMessageClicked = () => {
        // TODO: API call to send a message.
        console.log('handleSendMessageClicked');
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

export default WaitRequestMessenger;