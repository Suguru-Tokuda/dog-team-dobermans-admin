import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import HomepageContentService from '../../services/homepageContentService';
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

export default class PuppyMessageEditor extends Component {
    state = {
        messageBody: '',
        originalBody: '',
    };

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        HomepageContentService.getHomePageInfo()
            .then(res => {
                console.log(res);
                this.setState({ 
                    messageBody: res.data.puppyMessage,
                    originalBody: JSON.parse(JSON.stringify(res.data.puppyMessage))
                 });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading the message');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
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

    handleBodyChange = (messageBody) => {
        this.setState({ messageBody: messageBody, editing: true });
    }

    handleUpdateBtnClicked = async () => {
        this.setState({ formSubmitted: true });
        const { messageBody, originalBody } = this.state;
        let messageBodyToSend = messageBody;
        this.props.onShowLoading(false, 1);
        const regex = /\<img (.*?)>/g;
        const regexForSrc = /src="(.*?)"/;
        let result;
        const files = [];
        while ((result = regex.exec(messageBodyToSend)) !== null) {
            const dataURI = regexForSrc.exec(result[1])[1];
            if (dataURI.indexOf('data:image/') !== -1 && dataURI.indexOf('https://firebasestorage.googleapis.com/') === -1) {
                await fetch(dataURI)
                    .then(async (res) => {
                        await res.blob()
                            .then(async (bloblFile) => {
                                const newFile = new File([bloblFile], 'puppyUnavailableMessage', { type: 'image/png' });
                                try {
                                    const options = {
                                        maxSizeMB: 1,
                                        maxWidthOrHeight: 1280,
                                        useWebWorker: true
                                    };
                                    const compressedFile = await imageCompression(newFile, options);
                                    const image = await HomepageContentService.uploadPicture(compressedFile, 'puppy-unavailable-message');
                                    files.push(image);
                                } catch (err) {
                                    toastr.error(err);
                                }
                            });
                    });
            }
        }
        let counter = 0;
        messageBodyToSend = messageBodyToSend.replace(/\<img (.*?)>/g, (imageTag => {
            const src = regexForSrc.exec(imageTag)[1];
            if (src.indexOf('data:image/') !== -1 && src.indexOf('https://firebasestorage.googleapis.com/')) {
                imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}" class="img-fluid" /`)
            }
            counter++;
            return imageTag;
        }));
        while ((result = regex.exec(originalBody)) !== null) {
            const imageURL = regexForSrc.exec((result[1]))[1];
            const refRegex = /hompageContents%2Fpuppy-unavailable-message%2F(.*?)\?alt/g;
            const imageRef = refRegex.exec(imageURL);
            if (imageRef !== null) {
                const reference = imageRef[1];
                if (imageURL.indexOf('firebasestorage.googleapis.com') !== -1 && messageBodyToSend.indexOf(reference) === -1) {
                    await HomepageContentService.deleteFile(`hompageContents/puppy-unavailable-message/${reference}`);
                }
            }
        }
        HomepageContentService.updatePuppyMessage(messageBodyToSend)
            .then(() => {
                toastr.success('Successfully updated the unavailable message.');
                this.props.history.push('/puppies');
            })
            .catch(err => {
                toastr.error('There was an error in updating the unavailable message.');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { messageBody } = this.state;
        return ( 
            <div className="card">
                <div className="card-header">
                    <strong>Puppy Message</strong>
                </div>
                <div className="card-body">
                    <div className="row form-group">
                        <div className="col-12">
                            <ReactQuill
                                id="puppyUnavailableMessageEditor"
                                value={messageBody}
                                onChange={this.handleBodyChange}
                                theme="snow"
                                modules={this.getModules()}
                                formats={this.getFormats()}
                            />
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button type="button" className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>
                    <Link type="button" className="btn btn-secondary ml-2" to="/puppies">Cancel</Link>
                </div>
            </div>
        );
    }

}