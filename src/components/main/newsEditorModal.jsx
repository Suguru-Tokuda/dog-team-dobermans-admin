import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import HomepageContentsService from '../../services/homepageContentService';
import toastr from 'toastr';

class NewsEditorModal extends Component {
    state = {
        newsBody: '',
        formSubmitted: false,
    };

    constructor(props) {
        super(props);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.newsBody !== prevState.newsBody) {
            return { nextBody: nextProps.newsBody };
        }
        return null;
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

    handleBodyChange = (newsBody) => {
        this.setState({ newsBody });
    }

    handleUpdateBtnClicked = () => {
        const { newsBody } = this.state;
        this.props.onShowLoading(false, 1);
        HomepageContentsService.updateNews(newsBody)
            .then(() => {
                this.props.onUpdateData();
                toastr.success('Successfully updated the news data');
            })
            .catch(err => {
                toastr.error('There was an error in updating the news data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { newsBody } = this.state;
        return (
            <div className="modal fade" id="newsEditorModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>News Editor</h3>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                <div className="col-12">
                                    <ReactQuill
                                        id="newsEditor"
                                        value={newsBody}
                                        onChange={this.handleBodyChange}
                                        theme="snow"
                                        modules={this.getModules()}
                                        formats={this.getFormats()}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>
                            <button className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default NewsEditorModal;