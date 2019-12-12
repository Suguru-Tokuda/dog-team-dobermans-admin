import React, { Component } from 'react';
import VideoBackground from './videoBackground';

class Main extends Component {
    state = {
        video: {},
        news: {}
    }

    render() {
        const { news, video } = this.state;
        return (
            <React.Fragment>
                <VideoBackground video={video} onShowLoading={this.props.onShowLoading} onDoneLoading={this.props.onDoneLoading} />
            </React.Fragment>
        )
    }
}

export default Main;