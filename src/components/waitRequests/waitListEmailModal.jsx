import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import $ from 'jquery';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

class WaitListEmailModal extends Component {
    state = {
        waitRequests: [],
        subject: '',
        validations: {},
        body: '',
        placeholders: ['[FIRST_NAME]', '[LAST_NAME]'],
        selectedPlaceholder: '',
        formSubmitted: false
    };

    constructor(props) {
        super(props);
        this.quillRef = null;
        this.reactQuillRef = null;
        this.state.selectedPlaceholder = this.state.placeholders[0];
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

    componentDidMount () {
        this.attachQuillRefs();
        $('#waitListEmailModal').on('hidden.bs.modal', () => {
            const { validations, formSubmitted } = this.state;
            if (Object.keys(validations).length === 0 && formSubmitted === true) {
                this.setState({
                    waitRequests: [],
                    formSubmitted: false,
                    subject: '',
                    body: '',
                    validations: {}
                });
            }
        });
    }
      
    componentDidUpdate () {
        this.attachQuillRefs();
    }

    attachQuillRefs() {
        // Ensure React-Quill reference is available:
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        // Skip if Quill reference is defined:
        if (this.quillRef != null) return;
        const quillRef = this.reactQuillRef.getEditor();
        if (quillRef != null) this.quillRef = quillRef;
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

    handleBodyChange = (body) => {
        const { validations, placeholders } = this.state;
        if (body.length === 0) {
            validations.body = 'Enter body';
        } else {
            delete validations.body;
            const reg = /\[(.*?)\]/g;
            let result;
            while ((result = reg.exec(body)) !== null) {
                let counter = 0;
                placeholders.forEach(placeholder => {
                    if (result[0] === placeholder)
                        counter++;
                });
                if (counter === 0)
                    validations.body = "Contains invalid placeholders. Please check all square brackets ([])";
            }
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
                    <tr key={`waitRequestModal-${i}`}>
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
            toolbar: {
                container: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, { 'align': ['', 'center', 'right', 'justify']}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ]},
            imageResize: true,
            imageDrop: true
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

    getPlaceholderOptions() {
        const { placeholders } = this.state;
        return placeholders.map(placeholder => <option key={placeholder} value={placeholder}>{placeholder}</option>);
    }

    handleSendBtnClicked = () => {
        this.setState({ formSubmitted: true });
        const { subject, body, validations, placeholders } = this.state;
        let isValid = true;
        if (subject.length === 0) {
            isValid = false;
            validations.subject = 'Enter subject';
        }
        if (body.length === 0) {
            isValid = false;
            validations.body = 'Enter body';
        } else {
            const reg = /\[(.*?)\]/g;
            let result;
            while ((result = reg.exec(body)) !== null) {
                let counter = 0;
                placeholders.forEach(placeholder => {
                    if (result[0] === placeholder)
                        counter++;
                });
                if (counter === 0) {
                    validations.body = "Contains invalid placeholders. Please check all square brackets ([])";
                    isValid = false;
                }
            }
        }
        this.setState({ validations });
        if (isValid === true) {
            const { waitRequests } = this.state;
            const waitRequestIDs = waitRequests.map(waitRequest => waitRequest.waitRequestID);
            this.props.onSendBtnClicked(waitRequestIDs, subject, body);
        }
    }

    handleSetPlaceholder = (e) => {
        this.setState({ selectedPlaceholder: e.target.value });
    }

    insertPlaceholder = () => {
        const { selectedPlaceholder } = this.state;
        const range = this.quillRef.getSelection();
        const position = range ? range.index : 0;
        this.quillRef.insertText(position, selectedPlaceholder);
    }

    render() {
        const { subject, body, validations, selectedPlaceholder, formSubmitted } = this.state;
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
                            <div className="row">
                                <label className="col-2">Placeholder</label>
                                <div className="col-5">
                                    <div className="input-group">
                                        <select className="form-control" value={selectedPlaceholder} onChange={this.handleSetPlaceholder}>
                                            {this.getPlaceholderOptions()}
                                        </select>
                                        <div className="input-group-prepend">
                                            <button className="btn btn-success" onClick={this.insertPlaceholder}>Insert</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row form-group">
                                <label className="col-2">Subject</label>
                                <div className="col-10">
                                    <input className="form-control" type="text" value={subject} onChange={this.handleSubjectChanged} />
                                    {formSubmitted === true && typeof validations.subject !== 'undefined' && (
                                        <small className="text-danger">{validations.subject}</small>
                                    )}
                                </div>
                            </div>
                            <div className="row from-group">
                                <div className="col-12">
                                    <ReactQuill  
                                        ref={(el) => { this.reactQuillRef = el }}
                                        id="emailEditor" 
                                        value={body} 
                                        onChange={this.handleBodyChange} 
                                        theme="snow" 
                                        modules={this.getModules()} 
                                        formats={this.getFormats()} />
                                    {formSubmitted === true && typeof validations.body !== 'undefined' && (
                                        <small className="text-danger">{validations.body}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={this.handleSendBtnClicked}>Send</button>
                            <button className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WaitListEmailModal;