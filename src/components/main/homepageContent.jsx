import React, { Component } from 'react';
import VideoBackground from './videoBackground';
import News from './news';
import Banner from './banner';
import HomepageContentsService from '../../services/homepageContentService';
import toastr from 'toastr';
import $ from 'jquery';

class HomepageContent extends Component {
    state = {
        video: {},
        news: '',
        banner: {}
    };

    componentDidMount() {
        this.handleUpdateData();
    }

    handleUpdateData = () => {
        this.props.onShowLoading(false, 1);
        HomepageContentsService.getHomePageInfo()
            .then(res => {
                if (typeof res.data.backgroundVideo !== 'undefined') {
                    this.setState({ video: res.data.backgroundVideo });
                }
                if (typeof res.data.news !== 'undefined') {
                    this.setState({ news: res.data.news });
                }
                if (typeof res.data.banner !== 'undefined') {
                    this.setState({ banner: res.data.banner });
                }
                if ($('#newsEditorModal').is(':visible') === true) {
                    $('#newsEditorModal').modal('hide')
                }
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in downloading home page content data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { video, news, banner } = this.state;
        return (
            <React.Fragment>
                <VideoBackground {...this.props} video={video} onUpdateData={this.handleUpdateData} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                <News {...this.props} news={news} onUpdateData={this.handleUpdateData} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                <Banner {...this.props} banner={banner} onUpdateData={this.handleUpdateData} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
            </React.Fragment>
        );
    }
}

export default HomepageContent;