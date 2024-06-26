import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HomepageContentService from "../../services/homepageContentService";
import SortablePictureLlist from "../miscellaneous/sortablePictureList";
import ImageCropModal from "../miscellaneous/imageCropModal";
import ImageDeleteConfModal from "../miscellaneous/imageDeleteConfModal";
import toastr from "toastr";
import $ from "jquery";

class GalleryImageEditor extends Component {
  state = {
    images: [],
    tempImageFile: null,
    imageToDelete: {},
    imageDeleteIndex: -1,
  };

  componentDidMount() {
    this.props.showLoading({ reset: true, count: 1 });
    HomepageContentService.getHomePageInfo()
      .then((res) => {
        if (res.data.galleryImages) {
          this.setState({ images: res.data.galleryImages });
        }
      })
      .catch((err) => {
        console.log(err);
        toastr.error("There was an error in loading gallery images data.");
      })
      .finally(() => {
        this.props.doneLoading({ reset: true });
      });
  }

  getPictures = () => {
    let images = [];
    let pictureCards, pictureAddCard;
    if (Object.keys(this.state.images).length > 0) {
      images = this.state.images;

      if (typeof images !== "undefined" && images.length > 0) {
        pictureCards = (
          <SortablePictureLlist
            pictures={images}
            onSortEnd={this.handleUpdatePictureOrder.bind(this)}
            onDeletePictureBtnClicked={this.openImageDeleteConfModal.bind(this)}
          />
        );
      }
    }
    if (images.length <= 20) {
      pictureAddCard = (
        <div className="col-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleSelectImageClicked}
          >
            <i className="fa fa-picture-o"></i> Upload
          </button>
          <input
            id="picture-upload"
            type="file"
            accept="image/*"
            onChange={this.handleImageChange}
          />
        </div>
      );
    }
    return (
      <React.Fragment>
        {pictureCards}
        {pictureAddCard}
      </React.Fragment>
    );
  };

  handleSelectImageClicked() {
    $("#picture-upload").click();
  }

  handleUpdatePictureOrder = (images) => {
    this.setState({ images });
    HomepageContentService.updateGalleryImages(images);
  };

  handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ tempImageFile: event.target.files[0] });
    }
  };

  handleFinishImageCropping = async (newFile) => {
    this.props.showLoading({ reset: false, count: 1 });
    // upload a picture and get { reference, url }
    let newPicture;
    try {
      newPicture = await HomepageContentService.uploadPicture(
        newFile,
        "imageGallery"
      );
    } catch (err) {
      toastr.error("There was an error in uploading a file");
    }

    if (typeof newPicture !== "undefined") {
      // push the new picture reference
      const { images } = this.state;
      images.push(newPicture);
      HomepageContentService.updateGalleryImages(images)
        .then((res) => {
          toastr.success("Upload success");
          this.setState({ tempPictureFile: null });
        })
        .catch((err) => {
          toastr.error("There was an error in uploading a file");
        })
        .finally(() => {
          this.props.doneLoading({ reset: true });
        });
    }
  };

  handleDeletePicture = async (index) => {
    const images = this.state.images;
    const imageToDelete = images[index];
    images.splice(index, 1);
    try {
      await HomepageContentService.deleteFile(imageToDelete.reference);
      HomepageContentService.updateGalleryImages(images)
        .then(() => {
          toastr.success("Successfully deleted the picture");
          $("#imageDeleteConfModal").modal("hide");
          $(".modal-backdrop").remove();
          this.setState({ images });
        })
        .catch(() => {
          toastr.error("There was an error in deleting a picture");
        })
        .finally(() => {
          this.props.doneLoading({ reset: true });
        });
    } catch (err) {
      toastr.error("There was an error in deleting a picture");
    }
  };

  openImageDeleteConfModal = (index) => {
    const imageToDelete = this.state.images[index];
    this.setState({ imageToDelete: imageToDelete, imageDeleteIndex: index });
    $("#imageDeleteConfModal").modal("show");
  };

  handleCancelDeleteBtnClicked = () => {
    $("#imageDeleteConfModal").modal("hide");
    $(".modal-backdrop").remove();
    this.setState({ imageToDelete: {}, imageDeleteIndex: -1 });
  };

  handleResetTempImageFile = () => {
    this.setState({ tempImageFile: null });
  };

  render() {
    const { tempImageFile, imageToDelete, imageDeleteIndex, images } =
      this.state;
    return (
      <React.Fragment>
        <div className="card">
          <div className="card-header">
            <strong>Gallery Images ({images.length}/20)</strong>
          </div>
          <div className="card-body">
            <div className="row form-group" style={{ padding: "25px" }}>
              {this.getPictures()}
            </div>
          </div>
          <div className="card-footer">
            <Link className="btn btn-sm btn-secondary" to="/">
              Back
            </Link>
          </div>
        </div>
        <ImageCropModal
          imageFile={tempImageFile}
          onFinishImageCropping={this.handleFinishImageCropping.bind(this)}
          handleResetTempPictureFile={this.handleResetTempImageFile}
          aspectRatio={4 / 3}
        />
        <ImageDeleteConfModal
          image={imageToDelete}
          index={imageDeleteIndex}
          onCancelBtnClicked={this.handleCancelDeleteBtnClicked}
          onDoDeleteBtnClicked={this.handleDeletePicture.bind(this)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  authenticated: state.authenticated,
  loadCount: state.loadCount,
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => dispatch({ type: "SIGN_IN" }),
    logout: () => dispatch({ type: "SIGN_OUT" }),
    setUser: (user) => dispatch({ type: "SET_USER", user: user }),
    unsetUser: () => dispatch({ type: "UNSET_USER" }),
    getUser: () => dispatch({ type: "GET_USER" }),
    showLoading: (params) => dispatch({ type: "SHOW_LOADING", params: params }),
    doneLoading: () => dispatch({ type: "DONE_LOADING" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryImageEditor);
