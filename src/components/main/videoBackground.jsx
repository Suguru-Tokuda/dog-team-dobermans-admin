import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VideoBackground extends Component {
    state = {
        currentVideo: {},
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

    render() {
        const { currentVideo } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3>Video Background</h3>
                </div>
                <div className="card-body">
                    <div className="row form-group">
                        <label className="col-1"><strong>Title</strong></label>
                        <div className="col-4">
                            {currentVideo.title}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-1"><strong>Description</strong></label>
                        <div className="col-4">
                            {currentVideo.description}
                        </div>
                    </div>
                    {Object.keys(currentVideo).length > 0 && (
                        <div className="col-12">
                            <video src={currentVideo.url} alt={currentVideo.reference} muted autoPlay loop style={{width: '100%'}} />
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <Link to="/background-vide-editor" className="btn btn-primary">Edit</Link>
                </div>
            </div>
        );
    }
}

export default VideoBackground;