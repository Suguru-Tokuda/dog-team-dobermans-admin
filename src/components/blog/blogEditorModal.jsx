import React, { Component } from 'react';
import BlogService from '../../services/blogService';
import ReactQuill from 'react-quill';
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';
import $ from 'jquery';

class BlogEditorModal extends Component {
    state = {
        selectedBlog: null,
        subject: '',
        author: '',
        message: '',
        formSubmitted: false,
        action: '',
        validations: {},
        editing: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('#blogEditorModal').on('hidden.bs.modal', () => {
            this.setState({ editing: false });
        });
    }

    componentDidUpdate() {
        if (this.state.loadBlog === true) {
            this.setState({ loadBlog: false });

            this.loadBlog(this.state.selectedBlog.blogID);
        }
    }

    loadBlog = (blogID) => {
        this.props.onShowLoading(true, 1);
        BlogService.getBlog(blogID)
            .then(res => {
                this.setState({
                    subject: res.data.subject,
                    author: res.data.subject,
                    message: res.data.message,
                    formSubmitted: false
                });
            })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.selectedBlog !== null && JSON.stringify(nextProps.selectedBlog) !== JSON.stringify(prevState.selectedBlog)) || nextProps.action !== prevState.action) {
            const state = prevState;
            if ((nextProps.selectedBlog !== null && JSON.stringify(nextProps.selectedBlog) !== JSON.stringify(prevState.selectedBlog))) {
                state.selectedBlog = nextProps.selectedBlog;
                state.loadBlog = true;
            }
            if (nextProps.action !== prevState.action) {
                state.action = nextProps.action;
            }
            return state;
        }
        return null;
    }

    getModules() {
        return {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, { 'align': ['', 'center', 'right', 'justify']}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
        };
    }

    getFormats() {
        return [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'align', 'indent',
            'link', 'image'
        ];
    }

    getSubmitBtnLabel() {
        const { action } = this.state;
        if (action === 'create') {
            return 'Create';
        } else if (action === 'update') {
            return 'Update';
        }
        return '';
    }

    handleAuthorChange = (e) => {
        const author = e.target.value;
        const { validations } = this.state;
        if (author !== '') {
            delete validations.author;
        } else {
            validations.author = 'Enter author';
        }
        this.SetState({ author, validations });
    }

    handleSubjectChange = (e) => {
        const subject = e.target.value;
        const { validations } = this.state;
        if (subject !== '') { 
            delete validations.subject;
        } else {
            validations.subject = 'Enter subject';
        }
        this.setState({ subject, validations });
    }

    handleMessageChnaged = (message) => {
        const { validations } = this.state;
        if (message !== '') {
            delete validations.message;
        } else {
            validations.message = 'Enter message';
        }
        this.setState({ message, validations });
    }

    render() {
        const { subject, author, message, action, formSubmitted, validations } = this.state;
        return (
            <div className="modal fade" id="blogEditorModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Blog Editor</h3>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                <label className="col-2">Author</label>
                                <div className="col-5">
                                    <input className="form-control" type="text" value={author} onChange={this.handleAuthorChange} />
                                    {formSubmitted === true && typeof validations.author !== 'undefined' && (
                                        <small className="text-danger">{validations.author}</small>
                                    )}
                                </div>
                            </div>
                            <div className="row form-group">
                                <label className="col-2">Subject</label>
                                <div className="col-5">
                                    <input className="form-control" type="text" vallue={subject} onChange={this.handleSubjectChange} />
                                    {formSubmitted === true && typeof validations.subject !== 'undefined' && (
                                        <small className="text-danger">{validations.subject}</small>
                                    )}
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-12">
                                    {(action === 'create' || action === 'update') && (
                                        <React.Fragment>
                                            <ReactQuill
                                                value={message}
                                                onChange={this.handleMessageChnaged}
                                                theme="snow"
                                                modules={this.getModules()}
                                                formats={this.getFormats()}
                                            />
                                            {formSubmitted === true && typeof validations.author !== 'undefined' && (
                                                <small className="text-danger">{validations.author}</small>
                                            )}    
                                        </React.Fragment>
                                    )}
                                    {(action === 'view' || action === 'delete') && (
                                        <div dangerouslySetInnerHTML={{ __html: message }} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {(action === 'create' || action === 'update') && (
                                <button className="btn btn-primary" onClick={this.handleSubmitBtnClicked}>{this.getSubmitBtnLabel()}</button>
                            )}
                            {action === 'delete' && (
                                <button className="btn btn-danger" onClick={this.handleDeleteClicked}>Delete</button>
                            )}
                            <button className="btn btn-secondary" onClick={this.handleCancelClicked}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default BlogEditorModal;