import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HomepageContentService from '../../services/homepageContentService';
import toastr from 'toastr';
import $ from 'jquery';

class VideoBackgroundEditor extends Component {
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
        this.props.showLoading({ reset: true, count: 1 });
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
                const selections = {
                    title: backgroundVideo.title,
                    description: backgroundVideo.description,
                    tempVideoFile: null
                };
                this.setState({
                  video: video,
                  selections: selections,
                  originalData: originalData
                });
            })
            .catch(err => {
                toastr.error('There was an error in loading background video information');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
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
        const { selections, validations, originalData } = this.state;
        const title = event.target.value;
        if (title === '' && originalData.title === '') {
            validations.title = 'Enter title';
        }
        selections.title = title;
        this.setState({ selections });
    }

    handleDescriptionChanged = (event) => {
        const { selections } = this.state;
        const description = event.target.value;
        selections.description = description;
        this.setState({ selections });
    }

    handleVideoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const files = event.target.files;
            const file = files[0];
            const { selections, tempVideoObjectURL } = this.state;
            selections.tempVideoFile = file;
            if (tempVideoObjectURL !== '') {
                URL.revokeObjectURL(tempVideoObjectURL);
            }
            const newVideoURL = URL.createObjectURL(file);
            this.setState({ selections, tempVideoObjectURL: newVideoURL });
        }
    }

    handleClearVideoBtnClicked = () => {
        const { selections, tempVideoObjectURL } = this.state;
        if (tempVideoObjectURL !== '') {
            URL.revokeObjectURL(tempVideoObjectURL);
        }
        selections.tempVideoFile = null;
        this.setState({ selections, tempVideoObjectURL: '' });
    }

    handleSelectVideoClicked = () => {
        $('#video-upload').click();
    }

    handleUpdateBtn = async (e) => {
        e.preventDefault();
        const { selections, video, originalData, validations } = this.state;
        const selectionKeys = Object.keys(selections);
        let isValid = true;
        selectionKeys.forEach(key => {
            if (key !== 'tempVideoFile' && key !== 'description') {
                if (selections[key] === '' && originalData[key] === '') {
                    isValid = false;
                    validations[key] = `Enter ${key}`;
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
            this.props.showLoading({ reset: true, count: 1 });
            let videoToSend;
            if (selections.tempVideoFile !== null) {
                if (typeof video.reference !== 'undefined') {
                    try {
                        await HomepageContentService.deleteFile(video.reference);
                    } catch (err) {
                        console.log(err);
                    }
                }
                try {
                    videoToSend = await HomepageContentService.uploadVideo(selections.tempVideoFile);
                } catch (err) {
                    toastr.error('There was an error in uploading a video');
                    this.props.doneLoading({ reset: true });
                    return;
                }
            } else {
                videoToSend = video;
            }
            HomepageContentService.updateBackgroundVideo(selections.title, selections.description, videoToSend.url, videoToSend.reference)
                .then(() => {
                    toastr.success('Successfully updated the video.');
                    this.props.history.push('/');
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in uploading a video.');
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
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
        const { selections, validations, video, tempVideoObjectURL } = this.state;
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
                                <input type="text" className="form-control" onChange={this.handleTitleChanged} value={title} />
                                {validations.title && (
                                    <span className="text-danger">{validations.title}</span>
                                )}
                            </div>
                        </div>
                        <div className="row from-group mt-2">
                            <label className="col-2">Description</label>
                            <div className="col-5">
                                <input type="text" className="form-control" onChange={this.handleDescriptionChanged} value={description} />
                                {validations.description && (
                                    <span className="text-danger">{validations.description}</span>
                                )}
                            </div>
                        </div>
                        <div className="row form-group mt-5">
                            <div className="col-6">
                                {Object.keys(video).length > 0 && (
                                    <div className="card">
                                        <div className="card-header">
                                            <strong>Current Video</strong>
                                        </div>
                                        <div className="card-body">
                                        <video src={video.url} alt={video.reference} muted autoPlay loop style={{width: '100%'}} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-6">
                                <div className="card">
                                    <div className="card-header">
                                        <strong>New Video</strong>
                                    </div>
                                    {tempVideoObjectURL !== '' && (
                                        <div className="card-body">
                                            <video src={tempVideoObjectURL} alt="video" muted autoPlay loop style={{width: '100%'}} />
                                        </div>
                                    )}
                                    <div className="card-footer">
                                        <button type="button" className="btn btn-primary" onClick={this.handleSelectVideoClicked}><i className="fa fa-video-camera"></i> Select</button>
                                        <button className="btn btn-secondary ml-2" onClick={this.handleClearVideoBtnClicked}>Clear</button>
                                        <input id="video-upload" type="file" accept="video/mp4" onChange={this.handleVideoChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" onClick={this.handleUpdateBtn}>Update</button>
                        <button type="button" className="btn btn-secondary ml-2" onClick={this.handleUndoBtnClicked}><i className="fas fa-undo"></i> Undo</button>
                        <Link className="btn btn-secondary ml-2" to="/">Cancel</Link>
                    </div>
                </form>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoBackgroundEditor);