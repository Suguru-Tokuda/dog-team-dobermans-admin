import React, { Component } from 'react';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';

class PuppyConfirmation extends Component {
    state = {
        puppyID: '',
        initialParams: {},
        pictures: [],
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        this.state.initialParams = props.initialParams;
        this.state.dads = props.dads;
        this.state.moms = props.moms;
        if (Object.keys(this.state.initialParams).length === 0) {
            this.props.history.push('/puppies');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let hasUpdates;
        const state = prevState;
        if (prevState.dads.length !== nextProps.dads.length) {
            hasUpdates = true;
            state.dads = nextProps.dads;
        }
        if (prevState.moms.length !== nextProps.moms.length) {
            hasUpdates = true;
            state.moms = nextProps.moms;
        }
        if (prevState.pictures.length !== nextProps.pictures.length) {
            hasUpdates = true;
            state.pictures = nextProps.pictures;
        }
        if (hasUpdates === true) {
            return state;
        } else {
            return null;
        }
    }

    getDadName(parentID) {
        for (let i = 0, max = this.state.dads.length; i < max; i++) {
            if (parentID === this.state.dads[i].parentID)
                return this.state.dads[i].name;
        }
        return '';
    }

    getMomName(parentID) {
        for (let i = 0, max = this.state.moms.length; i < max; i++) {
            if (parentID === this.state.moms[i].parentID)
                return this.state.moms[i].name;
        }
        return '';
    }

    getPictures = () => {
        const pictures = this.state.pictures;
        if (pictures.length > 0) {
            const pictureCards = pictures.map((picture, i) => {
                const imageURL = URL.createObjectURL(picture);
                return (
                    <div key={`puppy-picture-${i}`} className="col-3">
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
        if (Object.keys(this.state.initialParams).length > 0) {
            const params = this.state.initialParams;
            return (
                <React.Fragment>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Name</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.name}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Sex</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.sex}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Type</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.type}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Color</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.color}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Dad</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.getDadName(params.dadId)}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Mom</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.getMomName(params.momId)}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Weight</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`${params.weight} lbs`}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Price</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`$${params.price}`}</div>
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1"><strong>Description</strong></label>
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{params.description}</div>
                    </div>
                </React.Fragment>
            )
        }
    }

    handleFinishBtnClicked = async () => {
        const data = this.state.initialParams;
        const pictures = this.state.pictures;
        let pictureLinks = [];
        this.props.onShowLoading(true, 1);
        if (pictures.length > 0) {
            for (let i = 0, max = pictures.length; i < max; i++) {
                const url = await PuppiesService.uploadPicture(pictures[i]);
                pictureLinks.push(url);
            }
        }
        data.pictures = pictureLinks;
        PuppiesService.createPuppy(data)
            .then(() => {
                toastr.success('New puppy created');
            })
            .catch(() => {
                toastr.error('There was an error in creating a puppy');
            })
            .finally(() => {
                this.props.onDoneLoading();
                this.props.history.push('/puppies');
            });
    }

    handleModifyBtnClicked = () => {
        this.props.history.push('/puppy/create/initial-params')
    }

    cancelBtnClicked = () => {
        this.props.onCancelBtnClicked();
        this.props.history.push('/puppies');
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
                    <button className="btn btn-sm btn-primary" onClick={this.handleFinishBtnClicked} type="button">Finish</button>
                    <button className="btn btn-sm btn-info ml-1" onClick={this.handleModifyBtnClicked} type="button">Modify</button>
                    <button className="btn btn-sm btn-secondary ml-1" onClick={this.cancelBtnClicked} type="button">Cancel</button>
                </div>
            </div>
        );
    }

}

export default PuppyConfirmation;