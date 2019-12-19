import React, { Component } from 'react';
import ReactQuill from 'react-quill';

class WaitListEmailModal extends Component {
    state = {
        waitRequests: [],
        subject: '',
        validations: {},
        body: '',
        formSubmitted: false
    };

    constructor(props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.waitRequests) !== JSON.stringify(prevState.waitRequests)) {
            return { 
                waitRequests: nextProps.waitRequests,
                formSubmitted: false,
                subject: '',
                body: '',
                validations: {}
            };
        }
        return null;
    }

    handleSubjectChanged = (e) => {
        const subject = e.target.value;
        const { validations } = this.state;
        if (subject.length === 0) {
            validations.subject = 'Enter subject';
        } else {
            delete validations.subject;
        }
        this.setState({ subject, validations });
    }

    handlebodyChanged = (body) => {
        const { validations } = this.state;
        if (body.length === 0) {
            validations.body = 'Enter body';
        } else {
            delete validations.body;
        }
        this.setState({ body, validations });
    }

    getTable() {
        const { waitRequests } = this.state;
        const thead = (
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Color</th>
                    </tr>
                </thead>
        );
        let tbody;
        if (waitRequests.length > 0) {
            const rows = waitRequests.map((waitRequest, i) => {
                return (
                    <tr>
                        <td>{waitRequest.firstName}</td>
                        <td>{waitRequest.lastName}</td>
                        <td>{waitRequest.email}</td>
                        <td>{waitRequest.color}</td>
                    </tr>
                )
            });
            tbody = <tbody>{rows}</tbody>
        }
        return (
            <div className="table-responsive">
                <table className="table table-fixed">
                    {thead}
                    {tbody}
                </table>
            </div>
        );
    }

    getModules() {
        return {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
        };
    }

    getFormats() {
        return [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ];
    }

    handleSendBtnClicked = () => {
        const { subject, body, validations } = this.state;
        let isValid = true;
        if (subject.length === 0) {
            isValid = false;
            validations.subject = 'Enter subject';
        }
        if (body.length === 0) {
            isValid = false;
            validations.body = 'Enter body';
        }
        this.setState({ validations });
        if (isValid === true) {
            const { waitRequests } = this.state;
            const waitRequestIDs = waitRequests.map(waitRequest => waitRequest.waitRequestID);
            this.props.onSendBtnClicked(waitRequestIDs, subject, body);
        }
    }

    render() {
        const { subject, body, validations } = this.state;
        return (
            <div className="modal fade" id="waitListEmailModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Wait List Notify Email</h3>
                            <p>The email will be sent to the selected customers</p>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    {this.getTable()}
                                </div>
                            </div>
                            <div className="row form-group">
                                <label className="col-2">Subject</label>
                                <div className="col-10">
                                    <input className="form-control" type="text" value={subject} onChange={this.handleSubjectChanged} />
                                    {typeof validations.subject !== 'undefined' && (
                                        <small className="text-danger">{validations.subject}</small>
                                    )}
                                </div>
                            </div>
                            <div className="row from-group">
                                <div className="col-12">
                                    <ReactQuill value={body} onChange={this.handlebodyChanged} theme="snow" modules={this.getModules()} formats={this.getFormats()} />
                                    {typeof validations.body !== 'undefined' && (
                                        <small className="text-danger">{validations.body}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary">Send</button>
                            <button className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WaitListEmailModal;