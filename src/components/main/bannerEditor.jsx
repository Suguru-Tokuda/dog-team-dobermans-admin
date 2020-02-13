import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import HomepageContentService from '../../services/homepageContentService';
import toastr from 'toastr';
import $ from 'jquery';
import imageCompression from 'browser-image-compression';

class BannerEditor extends Component {
    state = {
        title: '',
        description: '',
        bannerPicture: null,
        tempImageFile: null,
        tempPictureURL: null,
        originalBanner: null,
        formSubmitted: false
    };

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        HomepageContentService.getHomePageInfo()
            .then(res => {
                if (res.data.banner !== undefined) {
                    const bannerData = res.data.banner;
                    this.setState({
                        title: bannerData.title !== undefined ? bannerData.title : '',
                        description: bannerData.description !== undefined ? bannerData.description : '',
                        bannerPicture: bannerData.picture !== undefined ? bannerData.picture : null,
                    });
                    if (typeof res.data.banner !== 'undefined') {
                        this.setState({ originalBanner: JSON.parse(JSON.stringify(res.data)) });
                    }
                }
            })
            .catch(err => {
                toastr.error('There was an error in loading banner data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getBannerPicture = () => {
        const { bannerPicture, tempPictureURL } = this.state;
        if (bannerPicture !== null) {
            if (typeof bannerPicture.url !== 'undefined' && typeof bannerPicture.reference !== 'undefined') {
                return <img src={bannerPicture.url} alt={bannerPicture.reference} className="img-fluid mb-2" style={{width: "100%"}} />
            } else {
                return <img src={tempPictureURL} alt={tempPictureURL} className="img-fluid mb-2" style={{width: "100%"}} />
            }
        }
    }

    handleSetTitle = (event) => {
        const title = event.target.value;
        this.setState({ title });
    }

    handleSetDescription = (event) => {
        const description = event.target.value;
        this.setState({ description });
    }

    handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const { tempPictureURL } = this.state;
            if (tempPictureURL !== null)
            URL.revokeObjectURL(tempPictureURL);
            const objectURL = URL.createObjectURL(event.target.files[0]);
            this.setState({
                bannerPicture: event.target.files[0],
                tempPictureURL: objectURL
            });
        }
    }

    handleSelectImageClicked() {
        $('#picture-upload').click();
    }

    handleFinishImageCropping = (newFile) => {
        const { tempPictureURL } = this.state;
        if (tempPictureURL !== null)
            URL.revokeObjectURL(tempPictureURL);
        const objectURL = URL.createObjectURL(newFile);
        this.setState({ 
            bannerPicture: newFile,
            tempImageFile: null,
            tempPictureURL: objectURL
        });                        
    }

    handleResetTempPictureFile = () => {
        this.setState({ tempPictureFile: null });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ formSubmitted: true });
        const { originalBanner, title, description, bannerPicture } = this.state;
        this.props.onShowLoading(true, 1);
        const compressionOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true
        };
        if (originalBanner !== null) {
            if (typeof originalBanner.picture.reference !== 'undefined' && typeof bannerPicture.reference !== 'undefined') {
                if (originalBanner.picture.reference !== bannerPicture.reference) {
                    await HomepageContentService.deleteFile(originalBanner.picture.reference);
                }
            }
        }
        let picture;
        if (typeof bannerPicture.reference === 'undefined') {
            try {
                const compressedImageFile = await imageCompression(bannerPicture, compressionOptions);
                picture = await HomepageContentService.uploadPicture(compressedImageFile, 'banner');
            } catch (err) {
                toastr.error('There was an error in uploading an image');
                return;
            }
        } else {
            picture = bannerPicture;
        }
        HomepageContentService.updateBanner(title, description, picture)
            .then(() => {
                toastr.success('Successfully updated the banner');
                this.props.history.push('/');
            })
            .catch(err => {
                toastr.error('There was an error in updating the banner');
                console.log(err);
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { title, description, bannerPicture, formSubmitted } = this.state;
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <div className="card">
                        <div className="card-header">
                            Banner Editor
                        </div>
                        <form noValidate>
                            <div className="card-body">
                                <div className="row form-group">
                                    <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">
                                        Title
                                    </label>
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                                        <input type="text" className="form-control" value={title} onChange={this.handleSetTitle} />
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">
                                        Description
                                    </label>
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                                        <input type="text" className="form-control" value={description} onChange={this.handleSetDescription} />
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">
                                        Picture
                                    </label>
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                                        {bannerPicture !== null && (
                                            this.getBannerPicture()
                                        )}
                                        <React.Fragment>
                                        <button type="button" className="btn btn-primary" onClick={this.handleSelectImageClicked}><i className="fa fa-picture-o"></i> Select</button>
                                            <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                                            {(formSubmitted === true && bannerPicture === null) && (
                                                <small className="text-danger"><br />Select Picture</small>
                                            )}
                                        </React.Fragment>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary" onClick={this.handleSubmit} type="submit">Submit</button>
                                <Link className="btn btn-secondary ml-1" to="/">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login"/>;
        }
    }
}

export default BannerEditor;