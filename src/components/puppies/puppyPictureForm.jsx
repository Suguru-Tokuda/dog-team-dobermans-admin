import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import $ from 'jquery';

class PuppyPictureForm extends Component {
    state = {
        initialParams: {},
        pictures: [],
        tempPictureFile: null,
        croppedImageUrl: '',
        formSubmitted: false,
        crop: {
            unit: "%",
            width: 30,
            aspect: 16 / 9
        }
    };

    constructor(props) {
        super(props);
        this.state.initialParams = props.initialParams;
        if (Object.keys(this.state.initialParams).length === 0) {
            props.history.push('/puppies');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.initialParams !== nextProps.initialParams) {
            return { initialParams: nextProps.initialParams };
        } else {
            return null;
        }
    }

    getErrorMsg = () => {
        return this.state.pictures.length === 0 && this.state.formSubmitted === true ? <small className="text-danger">Select picture(s)</small> : null;
    }

    getPictures = () => {
        const pictures = this.state.pictures;
        let pictureCards, pictureAddCard;
        if (pictures.length > 0) {
            pictureCards = pictures.map((picture, i) => {
                const imageURL = URL.createObjectURL(picture);
                return (
                    <div key={`puppy-picture-${i}`} className="col-3">
                        <div className="row">
                            <div className="col-12">
                                <img src={imageURL} className="img-fluid" alt={imageURL} />
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-6">
                                <div className="float-left">
                                    <button className="btn btn-sm btn-danger" onClick={() => this.handleDeletePicture(i)}>x</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        if (this.state.pictures.length <= 4) {
            pictureAddCard = (
                <div className="col-3">
                    <label htmlFor="picture-upload" className="custom-file-upload">
                        <i className="fa fa-cloud-upload"></i> Upload
                    </label>
                    <input id="picture-upload" type="file" accept="image/*" onChange={this.handleImageChange} />
                </div>
            );
        }
        return (
            <div className="row">
                {pictureCards}
                {pictureAddCard}
            </div>
        );
    }

    onImageLoaded = (image) => {
        this.imageRef = image;
    }

    onCropComplete = (crop) => {
        console.log(crop);
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
              //reject(new Error('Canvas is empty'));
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

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            // const pictures = this.state.pictures;
            // pictures.push(event.target.files[0]);
            // this.setState({ pictures });
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.setState({ tempPictureFile: reader.result });
            });
            reader.readAsDataURL(event.target.files[0]);
        }
        $('#picture-upload').val(null);
    }

    handleDeletePicture = (index) => {
        const pictures = this.state.pictures;
        if (pictures.length > 0) {
            pictures.splice(index, 1);
            this.setState({ pictures });
        }
    }

    handleSkipBtnClicked = (event) => {
        event.preventDefault();
        this.props.history.push('/puppy/create/confirmation');
    }

    handleNextBtnClicked = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        if (this.state.pictures.length > 0) {
            this.props.onToConfirmBtnClicked(this.state.pictures);
            this.props.history.push('/puppy/create/confirmation');
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h1>Pictures</h1>
                    <div className="row form-group">
                        <div className="col-12">
                            {this.getPictures()}
                        </div>
                        <div className="col-12">
                            {this.getErrorMsg()}
                        </div>
                    </div>
                    {this.state.tempPictureFile && (
                        <div className="row form-group">
                            <div className="col-6">
                                <ReactCrop
                                    src={this.state.tempPictureFile}
                                    crop={this.state.crop}
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                />
                            </div>
                        </div>
                    )}
                    {this.state.croppedImageUrl && (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-7">
                                    <img alt="Crop" style={{ maxWidth: "100%" }} src={this.state.croppedImageUrl} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <button type="button" className="btn btn-success">Crop</button>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary" onClick={this.handleNextBtnClicked} type="submit">Next</button>
                    <button className="btn btn-success ml-1" onClick={this.handleSkipBtnClicked} type="button">Skip</button>
                    <Link className="btn btn-secondary ml-1" to="/puppies">Cancel</Link>
                </div>
            </div>
        );
    }
}

export default PuppyPictureForm;