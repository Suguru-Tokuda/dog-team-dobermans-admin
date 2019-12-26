import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import HomepageContentsService from '../../services/homepageContentService';
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';
import $ from 'jquery';

class NewsEditorModal extends Component {
    state = {
        newsBody: '',
        editing: false,
        formSubmitted: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('#newsEditorModal').on('hidden.bs.modal', () => {
            this.setState({ editing: false });
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.newsBody !== prevState.newsBody) {
            if (prevState.editing === false) {
                return { newsBody: nextProps.newsBody };
            }
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

    handleBodyChange = (newsBody) => {
        this.setState({ newsBody: newsBody, editing: true });
    }

    handleUpdateBtnClicked = async () => {
        this.setState({ formSubmitted: true });
        const { newsBody } = this.state;
        let newsBodyToSend = newsBody;
        this.props.onShowLoading(false, 1);
        const regex = /\<img (.*?)>/g;
        let result;
        const files = [];
        while ((result = regex.exec(newsBodyToSend)) !== null) {
            const regexForSrc = /src="(.*?)"/;
            const dataURI = regexForSrc.exec(result[1])[1];
            if (dataURI.indexOf('data:image/') !== -1 && dataURI.indexOf('https://firebasestorage.googleapis.com/') === -1) {
                await fetch(dataURI)
                    .then(async (res) => {
                        await res.blob()
                            .then(async (bloblFile) => {
                                const newFile = new File([bloblFile], 'news', { type: 'image/png' });
                                try {
                                    const options = {
                                        maxSizeMB: 1,
                                        maxWidthOrHeight: 1280,
                                        useWebWorker: true
                                    };
                                    const compressedFile = await imageCompression(newFile, options);
                                    const image = await HomepageContentsService.uploadPicture(compressedFile);
                                    files.push(image);
                                } catch (err) {
                                    toastr.error(err);
                                }
                            });
                    });
            }
        }
        let counter = 0;
        newsBodyToSend = newsBodyToSend.replace(/\<img (.*?)>/g, (imageTag => {
            const regexForSrc = /src="(.*?)"/;
            const src = regexForSrc.exec(imageTag)[1];
            if (src.indexOf('data:image/') !== -1 && src.indexOf('https://firebasestorage.googleapis.com/')) {
                imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}" class="img-fluid" /`)
            }
            counter++;
            return imageTag;
        }));

        HomepageContentsService.updateNews(newsBodyToSend)
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
        const { newsBody, formSubmitted } = this.state;
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
                                    {(formSubmitted === true && newsBody === '') && (
                                        <small className="text-danger">Enter message body</small>
                                    )}
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