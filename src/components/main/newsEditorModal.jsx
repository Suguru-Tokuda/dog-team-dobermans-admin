import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import HomepageContentService from '../../services/homepageContentService';
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';
import $ from 'jquery';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

class NewsEditorModal extends Component {
    state = {
        newsBody: '',
        originalBody: '',
        editing: false,
        formSubmitted: false,
    };

    componentDidMount() {
        $('#newsEditorModal').on('hidden.bs.modal', () => {
            this.setState({ editing: false });
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.newsBody !== prevState.newsBody) {
            if (prevState.editing === false) {
                return { 
                    newsBody: nextProps.newsBody,
                    originalBody: JSON.parse(JSON.stringify(nextProps.newsBody))
                };
            }
        }
        return null;
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
            'list', 'bullet', 'align', 'indent',
            'link', 'image'
        ];
    }

    handleBodyChange = (newsBody) => {
        this.setState({ newsBody: newsBody, editing: true });
    }

    handleUpdateBtnClicked = async () => {
        this.setState({ formSubmitted: true });
        const { newsBody, originalBody } = this.state;
        let newsBodyToSend = newsBody;
        this.props.showLoading({ reset: false, count: 1 });
        const regex = /\<img (.*?)>/g;
        const regexForSrc = /src="(.*?)"/;
        let result;
        const files = [];
        while ((result = regex.exec(newsBodyToSend)) !== null) {
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
                                    const image = await HomepageContentService.uploadPicture(compressedFile, 'news');
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
            const src = regexForSrc.exec(imageTag)[1];
            if (src.indexOf('data:image/') !== -1 && src.indexOf('https://firebasestorage.googleapis.com/')) {
                imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}" class="img-fluid" /`)
            }
            counter++;
            return imageTag;
        }));
        while ((result = regex.exec(originalBody)) !== null) {
            const imageURL = regexForSrc.exec((result[1]))[1];
            const refRegex = /hompageContents%2Fnews%2F(.*?)\?alt/g;
            const imageRef = refRegex.exec(imageURL);
            if (imageRef !== null) {
                const reference = imageRef[1];
                if (imageURL.indexOf('firebasestorage.googleapis.com') !== -1 && newsBodyToSend.indexOf(reference) === -1) {
                    await HomepageContentService.deleteFile(`hompageContents/news/${reference}`);
                }
            }
        }
        HomepageContentService.updateNews(newsBodyToSend)
            .then(() => {
                this.props.onUpdateData();
                toastr.success('Successfully updated the news data');
            })
            .catch(err => {
                toastr.error('There was an error in updating the news data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsEditorModal);