import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cropper from 'cropperjs';
import imageCompression from 'browser-image-compression';
import $ from 'jquery';
import toastr from 'toastr';

let image, cropper, croppedURL = null;

class ImageCropModal extends Component {
    state = {
        imageFile: null,
        imageURL: null,
        croppedURL: null,
        aspectRatio: 1,
        updateOriginalImage: false
    };

    constructor(props) {
        super(props);
        if (typeof props.aspectRatio !== 'undefined') {
            this.state.aspectRatio = props.aspectRatio;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.imageFile !== prevState.imageFile || (typeof nextProps.aspectRatio !== 'undefined' && nextProps.aspectRatio !== prevState.aspectRatio)) {
            const state = prevState;
            if (nextProps.imageFile !== null) {
                state.imageFile = nextProps.imageFile;
                state.fileName = nextProps.imageFile.name;
                state.imageURL = URL.createObjectURL(nextProps.imageFile);
                state.updateOriginalImage = true;
                state.croppedURL = null;
            } else {
                if (state.imageURL !== '')
                    URL.revokeObjectURL(state.imageURL);
                state.imageFile = null;
                state.imageURL = null;
            }
            return state;
        }
        return null;
    }

    componentDidMount() {
        image = document.getElementById('originalImage');
        const state = this;
        $('#imageCropModal')
            .on('shown.bs.modal', () => {
                cropper = new Cropper(image, {
                    aspectRatio: this.state.aspectRatio,
                    preview: '.preview',
                    cropend() {
                        if (cropper) {
                            cropper.getCroppedCanvas().toBlob((blob) => {
                                if (croppedURL !== null) {
                                    URL.revokeObjectURL(croppedURL);
                                }
                                croppedURL = URL.createObjectURL(blob);
                                state.setState({ croppedURL: URL.createObjectURL(blob) });
                            });
                        }
                    },
                    zoom() {
                        if (cropper) {
                            cropper.getCroppedCanvas().toBlob((blob) => {
                                if (croppedURL !== null) {
                                    URL.revokeObjectURL(croppedURL);
                                }
                                croppedURL = URL.createObjectURL(blob);
                                state.setState({ croppedURL: URL.createObjectURL(blob) });
                            });
                        }
                    }
                });
            })
            .on('hidden.bs.modal', () => {
                state.setState({
                    imageURL: null,
                    croppedURL: null,
                });
                this.props.handleResetTempPictureFile();
                cropper.destroy();
                cropper = null;
            });
    }

    componentDidUpdate() {
        const { updateOriginalImage } = this.state;
        if (updateOriginalImage === true) {
            this.setState({ updateOriginalImage: false });
            $('#imageCropModal').modal('show');
        }
    }

    handleRotate = () => {
        if (cropper) {
            cropper.rotate(45);
        }
    }

    handleCropBtnClicked = () => {
        const { croppedURL } = this.state;
        if (croppedURL !== null && croppedURL !== '') {
            this.props.showLoading({ reset: true, count: 1 });
            fetch(croppedURL)
                .then(res => {
                    res.blob()
                        .then(async (blobFile) => {
                            const newFile = new File([blobFile], 'new_picture', { type: 'image/png' });
                            try {
                                const options = {
                                    maxSizeMB: 0.30,
                                    maxWidthOrHeight: 500,
                                    useWebWorker: true
                                };
                                const compressedFile = await imageCompression(newFile, options);
                                this.props.onFinishImageCropping(compressedFile);
                                $('#imageCropModal').modal('hide');
                                $('.modal-backdrop').remove();
                                URL.revokeObjectURL(croppedURL);
                            } catch (err) {
                                toastr.err('There was an error in image cropping');
                            }
                        })
                        .catch(err => {
                            toastr.error('There was an error in image cropping');
                        })
                        .finally(() => {
                            this.props.doneLoading({ reset: true });
                        });
                })
        }
    }

    handleCancelBtnClicked = () => {
        $('#imageCropModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    render() {
        const { imageURL, croppedURL } = this.state;
        return (
            <div className="modal fade" id="imageCropModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" >Crop the image</h5>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <div className="img-container">
                                        <img id="originalImage" src={imageURL} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="preview"></div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.handleCancelBtnClicked}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleRotate}><i className="fa fa-rotate-right"></i></button>
                            <button type="button" className="btn btn-success" disabled={croppedURL === '' || croppedURL === null} onClick={this.handleCropBtnClicked}>Finish</button>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageCropModal);