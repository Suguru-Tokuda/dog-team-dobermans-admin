import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import AboutDobermanService from '../../services/aboutDobermanService';
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';
import $ from 'jquery';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

class AboutDobermansEditorModal extends Component {
    state = {
        body: '',
        originalBody: '',
        editing: false,
        formSubmitted: false,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('#aboutDobermansEditorModal').on('hidden.bs.modal', () => {
            this.setState({ editing: false });
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.body !== prevState.body) {
            if (prevState.editing === false) {
                return { 
                    body: nextProps.body,
                    originalBody: JSON.parse(JSON.stringify(nextProps.body))
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

    handleBodyChange = (body) => {
        this.setState({ body: body, editing: true });
    }

    handleUpdateBtnClicked = async () => {
        this.setState({ formSubmitted: true });
        const { body, originalBody } = this.state;
        let bodyToSend = body;
        this.props.onShowLoading(false, 1);
        const regex = /\<img (.*?)>/g;
        const regexForSrc = /src="(.*?)"/;
        let result;
        const files = [];
        while ((result = regex.exec(bodyToSend)) !== null) {
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
                                    const image = await AboutDobermanService.uploadPicture(compressedFile);
                                    files.push(image);
                                } catch (err) {
                                    toastr.error(err);
                                }
                            });
                    });
            }
        }
        let counter = 0;
        bodyToSend = bodyToSend.replace(/\<img (.*?)>/g, (imageTag => {
            const src = regexForSrc.exec(imageTag)[1];
            if (src.indexOf('data:image/') !== -1 && src.indexOf('https://firebasestorage.googleapis.com/')) {
                imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}" class="img-fluid"`)
            }
            counter++;
            return imageTag;
        }));
        while ((result = regex.exec(originalBody)) !== null) {
            const imageURL = regexForSrc.exec((result[1]))[1];
            const refRegex = /aboutDobermans\%2F(.*?)\?alt/g;
            const imageRef = refRegex.exec(imageURL);
            if (imageRef !== null) {
                const reference = imageRef[1];
                if (imageURL.indexOf('firebasestorage.googleapis.com') !== -1 && bodyToSend.indexOf(reference) === -1) {
                    await AboutDobermanService.deletePicture(`aboutDobermans/${reference}`);
                }
            }
        }
        AboutDobermanService.postAboutDobermans(bodyToSend)
            .then(() => {
                this.props.onUpdateData();
                toastr.success('Successfully updated the About Dobermans');
                $('#aboutDobermansEditorModal').modal('hide');
            })
            .catch(err => {
                toastr.error('There was an error in updating the About Dobermans');
            })
            .finally(() => {
                this.props.onDoneLoading();

            });
    }

    handleCancelClicked = () => {
        $('#aboutDobermansEditorModal').modal('hide');
    }

    render() {
        const { body, formSubmitted } = this.state;
        return (
            <div className="modal fade" id="aboutDobermansEditorModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>About Dobermans Editor</h3>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                <div className="col-12">
                                    <ReactQuill
                                        id="newsEditor"
                                        value={body}
                                        onChange={this.handleBodyChange}
                                        theme="snow"
                                        modules={this.getModules()}
                                        formats={this.getFormats()}
                                    />
                                    {(formSubmitted === true && body === '') && (
                                        <small className="text-danger">Enter message body</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>
                            <button className="btn btn-secondary" onClick={this.handleCancelClicked}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default AboutDobermansEditorModal;