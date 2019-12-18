import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import $ from 'jquery';

class WaitListEmailModal extends Component {
    state = {
        waitRequests: [],
        subject: '',
        emailBody: '',
    };

    constructor(props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.waitRequests) !== JSON.stringify(prevState.waitRequests)) {
            const waitRequests = [];
            for (let i = 0, max = 20; i < max; i++) {
                waitRequests.push(JSON.parse(JSON.stringify(nextProps.waitRequests[0])));
            }
            return { waitRequests: waitRequests };
        }
        return null;
    }

    handleSubjectChanged = (e) => {
        const subject = e.target.value;
        this.setState({ subject });
    }

    handleEmailBodyChanged = (emailBody) => {
        this.setState({ emailBody });
    }

    getTable() {
        const { waitRequests } = this.state;
        const thead = (
                <thead className="fixed-table-head">
                    <tr>
                        <th>Wait Request ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Color</th>
                        <th>Created</th>
                        <th>Last Notified</th>
                    </tr>
                </thead>
        );
        let tbody;
        if (waitRequests.length > 0) {
            const rows = waitRequests.map((waitRequest, i) => {
                return (
                    <tr>
                        <td>{waitRequest.waitRequestID}</td>
                        <td>{waitRequest.firstName}</td>
                        <td>{waitRequest.lastName}</td>
                        <td>{waitRequest.email}</td>
                        <td>{waitRequest.phone}</td>
                        <td>{waitRequest.color}</td>
                        <td>{waitRequest.created}</td>
                        <td>{waitRequest.notified}</td>
                    </tr>
                )
            });
            tbody = <tbody>{rows}</tbody>
        }
        return (
            <div className="table-responsive fixed-table">
                <table className="table table-sm table-striped table-hover">
                    {thead}
                    {tbody}
                </table>
            </div>
        )
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

    render() {
        const { subject, emailBody } = this.state;
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
                                <div className="col-10"><input className="form-control" type="text" value={subject} onChange={this.handleSubjectChanged} /></div>
                            </div>
                            <div className="row from-group">
                                <div className="col-12">
                                    <ReactQuill value={emailBody} onChange={this.handleEmailBodyChanged} theme="snow" modules={this.getModules()} formats={this.getFormats()} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary">Send</button>
                            <button className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default WaitListEmailModal;