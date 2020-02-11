import React, { Component } from 'react';
import HomepageContentService from '../../services/homepageContentService';
import toastr from 'toastr';

class VideoBackground extends Component {
    state = {
        currentVideo: {},
        tempVideoFile: null
    };

    constructor(props) {
        super(props);
        if (Object.keys(props.video).length > 0) {
            this.state.currentVideo = props.video;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.video) !== JSON.stringify(prevState.video)) {
            return { currentVideo: nextProps.video };
        }
        return null;
    }

    getVideoElement() {
        const { tempVideoFile } = this.state;
        let videoURL;
        if (tempVideoFile !== null) {
            videoURL = URL.createObjectURL(tempVideoFile);
        }
        return (
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
    }

    handleVideoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const files = event.target.files;
            const file = files[0];
            this.setState({ tempVideoFile: file })
        }
    }

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