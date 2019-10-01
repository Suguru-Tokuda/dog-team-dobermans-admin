import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import $ from 'jquery';
import toastr from 'toastr';

class PictureCropModal extends Component {
    state = {
        pictureFile: null,
        pictureFileName: '',
        croppedImageUrl: '',
        crop: {
            unit: "%",
            width: 30,
            aspect: 1 / 1
        }
    };

    constructor(props) {
        super(props);
        if (this.state.pictureFile !== null) {
            this.state.pictureFile = props.pictureFile;
            this.state.pictureFileName= props.pictureFile[0].name;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pictureFile !== prevState.pictureFile) {
            const state = prevState;
            if (nextProps.pictureFile !== null) {
                state.pictureFile = nextProps.pictureFile;
                state.pictureFileName = nextProps.pictureFile[0].name;
            } else {
                state.pictureFile = null;
                state.pictureFileName = '';
            }
            return state;
        }
        return null;
    }

    componentDidUpdate() {
        if (this.state.pictureFile !== null) {
            $('#pictureCropModal').modal('show');
        }
    }

    onImageLoaded = (image) => {
        this.imageRef = image;
    }

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    }

    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    }

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            crop,
            "newFile.jpeg"
          );
          this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
            if (!blob) {
                console.error("Canvas is empty");
                return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    handleCropBtnClicked = async () => {
        let newFile;
        await fetch(this.state.croppedImageUrl)
            .then(res => {
                res.blob()
                    .then(async (blobFile) => {
                        newFile = new File([blobFile], this.state.pictureFileName, { type: 'image/png' });
                        try {
                            const options = {
                                maxSizeMB: 1,
                                maxWidthOrHeight: 1280,
                                useWebWorker: true
                            };
                            const compressedFile = await imageCompression(newFile, options);
                            this.props.onFinishImageCropping(compressedFile);
                            $('#pictureCropModal').modal('hide');
                        } catch (err) {
                            toastr.err(err);
                        }
                    });
            });
    }

    render() {
        const { crop, pictureFile, croppedImageUrl } = this.state;
        return (
            <div className="modal fade" id="pictureCropModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            {pictureFile && (
                                <div className="row">
                                    <div className="col-6">
                                        <ReactCrop
                                            src={pictureFile}
                                            crop={crop}
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete}
                                            onChange={this.onCropChange} />
                                    </div>
                                    {croppedImageUrl && (
                                        <div className="col-6">
                                            <img alt="crop" style={{ maxWidth: "100%"}} src={croppedImageUrl} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={this.handleCropBtnClicked}>Finish</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PictureCropModal;