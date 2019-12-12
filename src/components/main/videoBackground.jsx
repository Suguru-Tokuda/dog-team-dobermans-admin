import React, { Component } from 'react';
import MainService from '../../services/mainService';

class VideoBackground extends Component {
    state = {
        video: {},
        tempVideoFile: null,
        uploadProgress: 0
    };

    constructor(props) {
        super(props);
        if (Object.keys(props.video).length > 0) {
            this.state.video = props.video;
        }
    }

    getVideoElement() {
        const { video, tempVideoFile } = this.state;
        let videoURL;
        if (tempVideoFile !== null) {
            videoURL = URL.createObjectURL(tempVideoFile);
        }
        console.log(videoURL);
        if (Object.keys(video).length > 0) {
            return <video src={video.url} muted autoPlay loop />;
        } else {
            return (
                <React.Fragment>
                    <div className="row">
                        <div className="col-12">
                            <label htmlFor="video-upload" className="custom-file-upload">
                                <i className="fa fa-video-camera"></i> Select
                            </label>
                            <input id="video-upload" type="file" accept="video/mp4" onChange={this.handleVideoChange} />
                        </div>
                        {tempVideoFile !== null && (
                            <React.Fragment>
                                <div className="col-12">
                                    <video src={videoURL} alt="video" muted autoPlay loop />
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary" onClick={this.handleUpload}>Upload</button>
                                </div>
                            </React.Fragment>
                        )}                            
                    </div>
                </React.Fragment>
            )
        }
    }

    handleVideoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const files = event.target.files;
            const file = files[0];
            this.setState({ tempVideoFile: file })
        }
    }

    handleUpload = () => {
        const { tempVideoFile } = this.state;
        let { uploadProgress } = this.state;
        this.props.onShowLoading(true, 1);
        MainService.uploadVideo(tempVideoFile, uploadProgress)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        return (
            <div className="row">
                <h2>Video Background</h2>
                <div className="col-12">
                    {this.getVideoElement()}
                </div>
            </div>
        )

    }
}

export default VideoBackground;