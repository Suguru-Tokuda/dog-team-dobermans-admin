import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import BlogService from '../../services/blogService';
import ReactQuill, { Quill } from 'react-quill';
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';
import $ from 'jquery';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

class BlogEditor extends Component {
    state = {
        blogID: undefined,
        title: '',
        author: '',
        message: '',
        formSubmitted: false,
        action: '',
        validations: {},
        thumbnailPicture: null,
        tempPictureFile: null,
        tempPictureURL: null,
        originalBlog: null
    };
    
    constructor(props) {
        super(props);
        const action = props.location.pathname.split('/')[2];
        const blogID = props.match.params.blogID;
        if (typeof blogID !== 'undefined' && blogID.length > 0)
        this.state.blogID = blogID;
        this.state.action = action;
    }
    
    componentDidMount() {
        const { blogID } = this.state;
        if (typeof blogID !== 'undefined' && blogID.length > 0) {
            this.loadBlog(blogID);
        }
    }

    loadBlog = (blogID) => {
        this.props.onShowLoading(true, 1);
        BlogService.getBlog(blogID)
            .then(res => {
                this.setState({
                    title: res.data.title,
                    author: res.data.author,
                    message: res.data.message,
                    thumbnailPicture: res.data.thumbnail,
                    formSubmitted: false,
                    originalBlog: JSON.parse(JSON.stringify(res.data))
                });
            })
            .catch(() => {
                toastr.error('There was an error in loading blog data');
                this.props.history.push('/blog')
            })
            .finally(() => {
                this.props.onDoneLoading();
            })
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

    getSubmitBtnLabel() {
        const { action } = this.state;
        if (action === 'create') {
            return 'Create';
        } else if (action === 'update') {
            return 'Update';
        }
        return '';
    }

    getThumbnailPicture = () => {
        const { thumbnailPicture, tempPictureURL } = this.state;
        if (thumbnailPicture !== null) {
            if (typeof thumbnailPicture.url !== 'undefined' && typeof thumbnailPicture.reference !== 'undefined') {
                return <img src={thumbnailPicture.url} alt={thumbnailPicture.reference} className="img-fluid" style={{width: "100%"}} />
            } else {
                return <img src={tempPictureURL} alt={tempPictureURL} className="img-fluid" style={{width: "100%"}} />
            }
        }
    }

    handleAuthorChange = (e) => {
        const author = e.target.value;
        const { validations } = this.state;
        if (author !== '') {
            delete validations.author;
        } else {
            validations.author = 'Enter author';
        }
        this.setState({ author, validations });
    }

    handletitleChange = (e) => {
        const title = e.target.value;
        const { validations } = this.state;
        if (title !== '') { 
            delete validations.title;
        } else {
            validations.title = 'Enter title';
        }
        this.setState({ title, validations });
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

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const { tempPictureURL, validations } = this.state;
            if (tempPictureURL !== null) {
                URL.revokeObjectURL(tempPictureURL);
            }
            delete validations.thumbnail;
            const objectURL = URL.createObjectURL(event.target.files[0]);
            this.setState({ thumbnailPicture: event.target.files[0], tempPictureURL: objectURL, validations: validations });
        }
    }

    handleSelectImageClicked() {
        $('#picture-upload').click();
    }

    handleSubmitBtnClicked = async () => {
        this.setState({ formSubmitted: true });
        const { originalBlog, blogID, author, title, message, thumbnailPicture, action, validations } = this.state;
        let isValid = true;
        if (author === '') {
            isValid = false;
            validations.author = 'Enter author';
        } else {
            delete validations.author;
        }
        if (title === '') {
            isValid = false;
            validations.title = 'Enter title';
        } else {
            delete validations.title;
        }
        if (message === '') {
            isValid = false;
            validations.message = 'Enter message';
        } else {
            delete validations.message;
        }
        if (thumbnailPicture === null) {
            isValid = false;
            validations.thumbnail = 'Select picture';
        } else {
            delete validations.thumbnail;
        }
        this.setState({ validations });
        if (isValid === true) {
            let messageToSend = message;
            this.props.onShowLoading(false, 1);
            const regex = /\<img (.*?)>/g;
            const regexForSrc = /src="(.*?)"/;
            let result;
            const files = [];
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true
            };
            while ((result = regex.exec(messageToSend)) !== null) {
                const dataURI = regexForSrc.exec(result[1])[1];
                if (dataURI.indexOf('data:image/') !== -1 && dataURI.indexOf('https://firebasestorage.googleapis.com/') === -1) {
                    await fetch(dataURI)
                        .then(async (res) => {
                            await res.blob()
                                .then(async (bloblFile) => {
                                    const newFile = new File([bloblFile], 'news', { type: 'image/png' });
                                    try {
                                        const compressedFile = await imageCompression(newFile, compressionOptions);
                                        const image = await BlogService.uploadPicture(compressedFile);
                                        files.push(image);
                                    } catch (err) {
                                        toastr.error(err);
                                    }
                                });
                        });
                }
            }
            let counter = 0;
            messageToSend = messageToSend.replace(/\<img (.*?)>/g, (imageTag => {
                const src = regexForSrc.exec(imageTag)[1];
                if (src.indexOf('data:image/') !== -1) {
                    imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}" class="img-fluid"`)
                }
                counter++;
                return imageTag;
            }));
            let thumbnailPictureToSend;
            if (typeof thumbnailPicture.url === 'undefined') {
                const compressedImage = await imageCompression(thumbnailPicture, compressionOptions);
                thumbnailPictureToSend = await BlogService.uploadPicture(compressedImage);
            } else {
                thumbnailPictureToSend = thumbnailPicture;
            }
            if (action === 'update') {
                if (typeof thumbnailPicture.reference === 'undefined') {
                    await BlogService.deleteImage(this.state.originalBlog.thumbnail.reference);
                }
            }
            if (action === 'update') {
                const previousMessage = originalBlog.message;
                while ((result = regex.exec(previousMessage)) !== null) { 
                    const imageURL = regexForSrc.exec((result[1]))[1];
                    const refRegex = /blogs\%2F(.*?)\?alt/g;
                    const imageRef = refRegex.exec(imageURL);
                    if (imageRef !== null) {
                        const reference = imageRef[1];
                        if (imageURL.indexOf('firebasestorage.googleapis.com') !== -1 && messageToSend.indexOf(reference) === -1) {
                            await BlogService.deleteImage(`blogs/${reference}`);
                        }
                    }
                }
            }
            if (action === 'create') {
                BlogService.createBlog(author, title, messageToSend, thumbnailPictureToSend)
                    .then(() => {
                        toastr.success('Successfully created a new blog.');
                        this.props.history.push('/blog');
                    })
                    .catch(err => {
                        toastr.error('There was an error in creating a new blog.')
                    })
                    .finally(() => {
                        const { tempPictureURL } = this.state;
                        if (tempPictureURL !== null) {
                            URL.revokeObjectURL(tempPictureURL);
                        }
                        this.props.onDoneLoading();
                    });
            } else if (action === 'update') {
                BlogService.updateBlog(blogID, author, title, messageToSend, thumbnailPictureToSend)
                    .then(() => {
                        toastr.success('Successfully updated a new blog.');
                        this.props.history.push('/blog');
                    })
                    .catch(err => {
                        toastr.error('There was an rror in updating a blog.')
                    })
                    .finally(() => {
                        const { tempPictureURL } = this.state;
                        if (tempPictureURL !== null) {
                            URL.revokeObjectURL(tempPictureURL);
                        }
                        this.props.onDoneLoading();
                    });
            }
        }
    }

    handleDeleteClicked = async () => {
        const { blogID, originalBlog } = this.state;
        this.props.onShowLoading(true, 1);
        // delete the thumbnail
        if (typeof originalBlog.thumbnail.reference !== 'undefined') {
            try {
                await BlogService.deleteImage(originalBlog.thumbnail.reference);
            } catch (err) {
                console.log(err);
            }
        }
        // delete all the images inside the message
        const regex = /\<img (.*?)>/g;
        const regexForAlt = /alt="(.*?)"/;
        let result;
        while ((result = regex.exec(originalBlog.message)) !== null) {
            const reference = regexForAlt.exec((result[1]));
            if (reference !== null && reference[1] !== null) {
                try {
                    await BlogService.deleteImage(reference[1]);
                } catch (err) {
                    console.log(err);
                }
            }
        }
        BlogService.deleteBlog(blogID)
            .then(() => {
                toastr.success('Successfully deleted a blog.');
                this.props.history.push('/blog');
            })
            .catch(() => {
                toastr.error('There was an error in deleting a blog.');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { title, author, message, action, formSubmitted, validations, thumbnailPicture, tempPictureFile } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h3>Blog Editor</h3>
                    </div>
                    <div className="card-body">
                        <div className="row form-group">
                            <label className="col-2">Author</label>
                            <div className="col-5">
                                <input className="form-control" type="text" value={author} onChange={this.handleAuthorChange} disabled={action === 'view' || action === 'delete'} />
                                {formSubmitted === true && typeof validations.author !== 'undefined' && (
                                    <small className="text-danger">{validations.author}</small>
                                )}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-2">Title</label>
                            <div className="col-5">
                                <input className="form-control" type="text" value={title} onChange={this.handletitleChange} disabled={action === 'view' || action === 'delete'} />
                                {formSubmitted === true && typeof validations.title !== 'undefined' && (
                                    <small className="text-danger">{validations.title}</small>
                                )}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-2">Thumbnail</label>
                            <div className="col-5">
                                {thumbnailPicture !== null && (
                                    this.getThumbnailPicture()
                                )}
                                {(action === 'create' || action === 'update') && (
                                    <React.Fragment>
                                        <button type="button" className="btn btn-primary" onClick={this.handleSelectImageClicked}><i className="fa fa-picture-o"></i> Upload</button>
                                        <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                                        {formSubmitted === true && typeof validations.thumbnail !== 'undefined' && (
                                            <small className="text-danger"><br />{validations.thumbnail}</small>
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-2">Blog body</label>
                            <div className="col-10">
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
                    <div className="card-footer">
                        {(action === 'create' || action === 'update') && (
                            <button className="btn btn-primary" onClick={this.handleSubmitBtnClicked}>{this.getSubmitBtnLabel()}</button>
                        )}
                        {action === 'delete' && (
                            <button className="btn btn-danger" onClick={this.handleDeleteClicked}>Delete</button>
                        )}
                        <Link className="btn btn-secondary ml-2" to="/blog">Cancel</Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default BlogEditor;