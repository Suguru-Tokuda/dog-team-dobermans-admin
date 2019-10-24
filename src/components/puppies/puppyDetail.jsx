import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesService from '../../services/puppiesService';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class PuppyDetail extends Component {
    state = {
        puppyID: '',
        puppyData: {},
        dads: [],
        moms: [],
        loadDetail: true
    };

    constructor(props) {
        super(props);
        if (typeof props.match !== 'undefined') 
            this.state.puppyID = props.match.params.puppyID;
        else
            this.state.puppyID = props.puppyID;
        if (typeof props.loadDetail !== 'undefined') {
            this.state.loadDetail = props.loadDetail;
        }
        if (typeof props.puppyDetail !== 'undefined') {
            this.state.puppyData = props.puppyDetail;
        }
    }

    async componentDidMount() {
        const { loadDetail } = this.state;
        if (loadDetail === true) {
            this.props.onShowLoading(true, 1);
            try {
                const [puppyData, parents] = await Promise.all([
                    PuppiesService.getPuppy(this.state.puppyID),
                    ParentsService.getAllParents()
                ]);
                const dads = [];
                const moms = [];
                parents.data.forEach(parent => {
                    if (parent.sex === 'male') {
                        dads.push(parent);
                    } else if (parent.sex === 'female') {
                        moms.push(parent);
                    }
                });
                this.setState({
                    puppyData: puppyData.data,
                    dads: dads,
                    moms: moms
                });
            } catch {
                toastr.error('There was an error in loading data');
            } finally {
                this.props.onDoneLoading();
            }
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
        if (Object.keys(this.state.puppyData).length > 0) {
            const pictures = this.state.puppyData.pictures;
            if (pictures.length > 0) {
                const pictureCards = pictures.map((picture, i) => {
                    return (
                        <div key={`puppy-picture-${i}`} className="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-2">
                            <div className="row">
                                <div className="col-12">
                                    <img src={picture.url} className="img-fluid" alt={picture.reference} />
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
                            {pictureCards}
                        </div>
                    </React.Fragment>
                );
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    getPuppyData() {
        if (Object.keys(this.state.puppyData).length > 0) {
            const { puppyData, puppyID } = this.state;
            return (
                <div className="card">
                    <div className="card-body">
                        <h3 className="mb-3">Puppy Info</h3>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Name</strong></label>
                            {puppyData.name && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyData.name}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Sex</strong></label>
                            {puppyData.sex && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyData.sex}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Type</strong></label>
                            {puppyData.type && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyData.type}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Color</strong></label>
                            {puppyData.color && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyData.color}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Dad</strong></label>
                            {puppyData.dadID && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.getDadName(puppyData.dadID)}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Mom</strong></label>
                            {puppyData.momID && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.getMomName(puppyData.momID)}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Weight</strong></label>
                            {puppyData.weight && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`${puppyData.weight} lbs`}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Price</strong></label>
                            {puppyData.price && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`$${puppyData.price}`}</div>
                            )}
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Description</strong></label>
                            {puppyData.description && (
                                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyData.description}</div>
                            )}
                        </div>
                        {this.getPictures()}
                    </div>
                    {(this.props.hideButtons === false || this.props.hideButtons === undefined) && (
                        <div className="card-footer">
                            <Link to={`/puppy/update/${puppyID}`} className="btn btn-sm btn-success">Update</Link>
                            <Link to="/puppies" className="btn btn-sm btn-secondary ml-2">Back</Link>
                        </div>
                    )}
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            this.getPuppyData()
        );
    }
}

export default PuppyDetail;