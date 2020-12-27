import React, { Component } from 'react';
import VideoBackground from './videoBackground';
import { connect } from 'react-redux';
import Banner from './banner';
import GalleryImages from './galleryImages';
import HomepageContentsService from '../../services/homepageContentService';
import toastr from 'toastr';
import $ from 'jquery';

class HomepageContent extends Component {
    state = {
        video: {},
        news: '',
        banner: {},
        galleryImages: []
    };

    componentDidMount() {
        this.handleUpdateData();
    }

    handleUpdateData = () => {
        this.props.showLoading({ reset: false, count: 1 });
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
                if (res.data.galleryImages) {
                    this.setState({ galleryImages: res.data.galleryImages });
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
                this.props.doneLoading({ reset: true });
            });
    }

    render() {
        const { video, news, banner, galleryImages } = this.state;
        return (
            <React.Fragment>
                <VideoBackground {...this.props} video={video} onUpdateData={this.handleUpdateData}  />
                <GalleryImages {...this.props} images={galleryImages}  />
                {/* <News {...this.props} news={news} onUpdateData={this.handleUpdateData}  /> */}
                <Banner {...this.props} banner={banner} onUpdateData={this.handleUpdateData}  />
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomepageContent);