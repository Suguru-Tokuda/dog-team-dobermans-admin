import React, { Component } from 'react';
import Cropper from 'cropperjs';
import $ from 'jquery';

let image, cropper = null;

class PictureCropModal_new extends Component {
    state = {
        imageURL: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspectRatio: 1,
        updateOriginalImage: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.imageURL !== prevState.imageURL || (typeof nextProps.aspectRatio !== 'undefined' && nextProps.aspectRatio !== prevState.aspectRatio)) {
            const state = prevState;
            if (nextProps.imageURL !== null) {
                state.updateOriginalImage = true;
                state.imageURL = nextProps.imageURL;
            } else {
                if (state.imageURL !== '')
                    URL.revokeObjectURL(state.imageURL);
                state.imageURL = null;
            }
            return state;
        }
        return null;
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        const { updateOriginalImage } = this.state;
        if (updateOriginalImage === true) {
            this.setState({ updateOriginalImage: false });
            image = document.getElementById('originalImage');
            $('#imageCropModal').modal('show');
        }
        $('#imageCropModal')
            .on('shown.bs.modal', () => {
                console.log(image);
                cropper = new Cropper(image, {
                    aspectRatio: 1,
                    viewMode: 3,
                    cropend(event) {
                        const data = cropper.getCroppedCanvas();
                        // if (event.type === 'cropend') {
                        //     cropper.getCroppedCanvas().toBlob((blob) => {
                        //         console.log(blob);
                        //     });
                        // }
                    },
                    zoom(event) {
                        if (event.type === 'zoom') {
                            // cropper.getCroppedCanvas().toBlob((blob) => {
                            //     console.log(blob);
                            // });
                        }
                    }
                });
            })
            .on('hidden.bs.modal', () => {
                cropper.destroy();
                cropper = null;
            });
    }

    render() {
        const { imageURL } = this.state;
        return (
            <div className="modal fade" id="imageCropModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" >Crop the image</h5>
                        </div>
                        <div className="modal-body">
                            <div className="img-container">
                                <img id="originalImage" src={imageURL} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={this.handleCropBtnClicked}>Finish</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PictureCropModal_new;