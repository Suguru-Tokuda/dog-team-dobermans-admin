import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import HomepageContentService from '../../services/homepageContentService';
import toastr from 'toastr';

export default class VideoBackgroundEditor extends Component {
    state = {
        video: {},
        selections: {
            title: '',
            description: '',
            tempVideoFile: null,
        },
        originalData: {},
        validations: {},
        tempVideoObjectURL: ''
    };
    
    componentDidMount() {
        this.props.onShowLoading(true, 1);
        HomepageContentService.getHomePageInfo()
            .then(res => {
                const backgroundVideo = res.data.backgroundVideo;
                const video = {
                    url: backgroundVideo.url,
                    reference: backgroundVideo.reference
                };
                const originalData = {
                    video: video,
                    title: backgroundVideo.title,
                    description: backgroundVideo.description
                };
                this.setState({
                  video: video,
                  title: backgroundVideo.title,
                  description: backgroundVideo.description,
                  originalData: originalData
                });
            })
            .catch(err => {
                toastr.error('There was an error in loading background video information');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    renderCurrentVideo() {
        const { video } = this.state;
        if (Object.keys(video).length > 0) {
            return (
                <div className="card">
                    <div className="card-header">
                        <h3>Current Background Video</h3>
                    </div>
                    <div className="card-body">
                        <video src={video.url} alt={video.reference} muted autoPlay loop style={{width: '100%'}} />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    renderVideoElement() {
        const { tempVideoFile, tempVideoObjectURL } = this.state;
        let videoURL;
        if (tempVideoFile !== null) {
            videoURL = URL.createObjectURL(tempVideoFile);
        }
        return (
<<<<<<< HEAD
            <React.Fragment>
                <div className="col-6">
                    <div className="row">
                        <label className="col-3">New Video</label>
                        <div className="col-9">
                            {tempVideoObjectURL !== '' && (
                                <video src={videoURL} alt="video" muted autoPlay loop style={{width: '100%'}} />
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="video-upload" className="custom-file-upload">
                                <i className="fa fa-video-camera"></i> Select
                            </label>
                            <input id="video-upload" type="file" accept="video/mp4" onChange={this.handleVideoChange} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleTitleChanged = (event) => {
        const { validations } = this.state;
        const title = event.targeet.value;
        if (title.length === 0) {
            validations.title = 'Enter title';
        } else {
            delete validations.title;
        }
        this.setState({ title, validadtions });
    }

    handleDescriptionChanged = (event) => {
        const { validations } = this.state;
        const description = event.targeet.value;
        if (description.length === 0) {
            validations.description = 'Enter description';
        } else {
            delete validations.description;
        }
        this.setState({ description, validadtions });
=======
            <div className="card">
                <div className="card-header">
                    <h3>New Video</h3>
                </div>
                {tempVideoFile !== null && (
                    <div className="card-body">
                        <div className="row">
                                <div className="col-12">
                                    <video src={videoURL} alt="video" muted autoPlay loop style={{width: '100%'}} />
                                </div>
                        </div>
                    </div>
                )}
                <div className="card-footer">
                    <label htmlFor="video-upload" className="custom-file-upload">
                        <i className="fa fa-video-camera"></i> Select
                    </label>
                    <input id="video-upload" type="file" accept="video/mp4" onChange={this.handleVideoChange} />
                    {tempVideoFile !== null && (
                            <button className="btn btn-primary ml-2" onClick={this.handleUpload}>Upload</button>
                    )}                            
                </div>
            </div>
        );
    }

    getCurrentVideo() {
        const { currentVideo } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3>Current Background Video</h3>
                </div>
                <div className="card-body">
                    <video src={currentVideo.url} alt={currentVideo.reference} muted autoPlay loop style={{width: '100%'}} />
                </div>
            </div>
        )
>>>>>>> dd01041ad81e815de5ccd9ccc301b3e39bacdca8
    }

    handleVideoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const files = event.target.files;
            const file = files[0];
            this.setState({ tempVideoFile: file })
        }
    }

<<<<<<< HEAD
    handleUpdateBtn = async () => {
        const { selections, video, originalData, validations } = this.state;
        const selectionKeys = Object.keys(selections);
        let isValid = true;
        selectionKeys.forEach(key => {
            if (key !== 'tempVideoFile') {
                if (selections[key] === '' && originalData[key] === '') {
                    isValid = false;
                    validaitons[key] = `Enter ${key}`;
                }
            } else if (key === 'tempVideoFile') {
                if (selections.tempVideoFile === null && Object.keys(originalData.video) === 0) {
                    isValid = false;
                    validations.tempVideoFile = 'Select video';
                }
            }
        });
        this.setState({ validations });
        if (isValid === true) {
            this.props.onShowLoading(true, 1);
            let videoToSend;
            if (tempVideoFile !== null) {
                if (typeof video.reference !== 'undefined') {
                    try {
                        await HomepageContentService.deleteFile(video.reference);
                    } catch (err) {
                        console.log(err);
                    }
                }
                try {
                    videoToSend = await HomepageContentService.updateBackgroundVideo(tempVideoFile);
                } catch (err) {
                    toastr.error('There was an error in uploading a video');
                    this.props.onDoneLoading();
                    return;
                }
            } else {
                videoToSend = video;
            }
            HomepageContentService.updateBackgroundVideo(title, description, videoToSend.url, videoToSend.reference)
                .then(() => {
                    toastr.success('Successfully updated the video.');
                    this.props.history.push('/');
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in uploading a video.');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    handleUndoBtnClicked = () => {
        const { originalData } = this.state;
        this.setState({
            vidoe: originalData.video,
            title: originalData.title,
            description: originalData.description
        });
    }

    render() {
        const { selections, validations, video } = this.state;
        const { title, description } = selections;
        return (
            <div className="card">
                <div className="card-header">
                    <strong>Video Background Editor</strong>
                </div>
                <form noValidate>
                    <div className="card-body">
                        <div className="row from-group">
                            <label className="col-2">Title</label>
                            <div className="col-5">
                                <input type="text" onKeyUp={this.handleTitleChanged} value={title} />
                                {validations.title && (
                                    <span className="text-danger">{validations.title}</span>
                                )}
                            </div>
                        </div>
                        <div className="row from-group">
                            <label className="col-2">Description</label>
                            <div className="col-10">
                                <input type="text" onKeyUp={this.handleDescriptionChanged} value={description} />
                                {validations.description && (
                                    <span className="text-danger">{validations.description}</span>
                                )}
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-6">
                                {Object.keys(video).length > 0 && (
                                    <div className="card">
                                        <div className="card-header">
                                            <h3>Current Background Video</h3>
                                        </div>
                                        <div className="card-body">
                                            <video src={video.url} alt={video.reference} muted autoPlay loop style={{width: '100%'}} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <label className="col-3">New Video</label>
                                    <div className="col-9">
                                        {tempVideoObjectURL !== '' && (
                                            <video src={videoURL} alt="video" muted autoPlay loop style={{width: '100%'}} />
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <label htmlFor="video-upload" className="custom-file-upload">
                                            <i className="fa fa-video-camera"></i> Select
                                        </label>
                                        <input id="video-upload" type="file" accept="video/mp4" onChange={this.handleVideoChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" onClick={this.handleUpdateBtn}>Update</button>
                        <button type="button" className="btn btn-secondary" onClick={this.handleUndoBtnClicked}><i className="fas fa-undo"></i> Undo</button>
                        <Link className="btn btn-secondary" to="/">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }

}
=======
    handleUpload = async () => {
        const { currentVideo, tempVideoFile } = this.state;
        this.props.onShowLoading(true, 1);
        // if there is already a video currently uploaded, delete it first
        if (typeof currentVideo.reference !== 'undefined') {
            await HomepageContentService.deleteFile(currentVideo.reference);
        }
        HomepageContentService.uploadVideo(tempVideoFile)
            .then(async res => {
                const video = res;
                await HomepageContentService.updateBackgroundVideo(video.url, video.reference);;
                toastr.success('Successfully uploaded the video');
                this.setState({ tempVideoFile: null });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in uploading a video');
            })
            .finally(() => {
                this.props.onUpdateData();
                this.props.onDoneLoading();
            });
    }

    render() {
        const { currentVideo } = this.state;
        return (
            <div className="row">
                <div className="col-12">
                    <h2>Video Background</h2>
                </div>
                {Object.keys(currentVideo).length > 0 && (
                    <div className="col-6">
                        {this.getCurrentVideo()}
                    </div>
                )}
                <div className="col-6">
                    {this.getVideoElement()}
                </div>
            </div>
        );
    }
}

export default VideoBackground;
>>>>>>> dd01041ad81e815de5ccd9ccc301b3e39bacdca8
