import React, { Component } from 'react';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class ParentConfirmation extends Component {
    state = {
        parentId: '',
        initialParams: {},
        pictures: []
    };

    constructor(props) {
        super(props);
        this.state.initialParams = props.initialParams;
        this.state.pictures = props.pictures;
        if (Object.keys(this.state.initialParams).length === 0) {
            this.props.history.push('/parents');
        }
    }

    getPictures = () => {
        const pictures = this.state.pictures;
        if (pictures.length > 0) {
            const pictureCards = pictures.map((picture, i) => {
                const imageURL = URL.createObjectURL(picture);
                return (
                    <div key={`parent-picture-${i}`} className="col-3">
                        <div className="row">
                            <div className="col-12">
                                <img src={imageURL} className="img-fluid" alt={imageURL} />
                            </div>
                        </div>
                    </div>
                );
            });
            return (
                <React.Fragment>
                    <div className="row">
                        <div className="col-12">
                            <h4>Pictures</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                {pictureCards}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }

    getInitialParams = () => {
        const { initialParams } = this.state;
        if (Object.keys(initialParams).length > 0) {
            const params = initialParams;
            return (
                <React.Fragment>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-ld-1"><strong>Name</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.name}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-ld-1"><strong>Sex</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.sex}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-ld-1"><strong>Type</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.type}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-ld-1"><strong>Color</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.color}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-ld-1"><strong>Weight</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.weight}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-ld-1"><strong>Description</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.description}</div>
                    </div>
                </React.Fragment>
            );
        }
    }

    handleFinishBtnClicked = async () => {
        const data = this.state.initialParams;
        const pictures = this.state.pictures;
        let pictureLinks = [];
        this.props.onShowLoading(true, 1);
        if (pictures.length > 0) {
            for (let i = 0, max = pictures.length; i < max; i++) {
                const url = await ParentsService.uploadPicture(pictures[i]);
                pictureLinks.push(url);
            }
        }
        data.pictures = pictureLinks;
        data.live = false;
        ParentsService.createParent(data)
            .then(() => {
                toastr.success('New parent create');
            })
            .catch(() => {
                toastr.error('There was an error in creating a puppy');
            })
            .finally(() => {
                this.props.onDoneLoading();
                this.props.history.push('/parents');
            });
    }

    handleModifyBtnClicked = () => {
        this.props.history.push('/parent/create/initial-params');
    }

    cancelBtnClicked = () => {
        this.props.onCancelBtnClicked();
        this.props.history.push('/parents');
    }

    render() {
        return (
           <div className="card">
               <div className="card-body">
                   <h3>Confirmation</h3>
                   {this.getInitialParams()}
                   {this.getPictures()}
               </div>
               <div className="card-footer">
                   <button type="button" className="btn btn-sm btn-primary" onClick={this.handleFinishBtnClicked}>Finish</button>
                   <button type="button" className="btn btn-sm btn-info ml-1" onClick={this.handleModifyBtnClicked}>Change</button>
                   <button type="button" className="btn btn-sm btn-secondary ml-1" onClick={this.cancelBtnClicked}>Cancel</button>
               </div>
           </div>
        );
    }
}

export default ParentConfirmation;