import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesService from '../../services/puppiesService';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class PuppyDetail extends Component {
    state = {
        puppyId: '',
        puppyData: {},
        dads: [],
        moms: [],
    };

    constructor(props) {
        super(props);
        if (typeof props.match !== 'undefined') 
            this.state.puppyId = props.match.params.puppyId;
        else
            this.state.puppyId = props.puppyId;
    }

    async componentDidMount() {
        // API call to load puppy data
        this.props.onShowLoading(true, 1);
        try {
            const [puppyData, parents] = await Promise.all([
                PuppiesService.getPuppy(this.state.puppyId),
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

    getDadName(parentId) {
        for (let i = 0, max = this.state.dads.length; i < max; i++) {
            if (parentId === this.state.dads[i].parentId)
                return this.state.dads[i].name;
        }
        return '';
    }

    getMomName(parentId) {
        for (let i = 0, max = this.state.moms.length; i < max; i++) {
            if (parentId === this.state.moms[i].parentId)
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
                )
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    getPuppyData() {
        if (Object.keys(this.state.puppyData).length > 0) {
            return (
                <div className="card">
                    <div className="card-body">
                        <h3 className="mb-3">Puppy Info</h3>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Name</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.state.puppyData.name}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Sex</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.state.puppyData.sex}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Type</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.state.puppyData.type}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Color</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.state.puppyData.color}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Dad</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.getDadName(this.state.puppyData.dadId)}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Mom</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.getMomName(this.state.puppyData.momId)}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Weight</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`${this.state.puppyData.weight} lbs`}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Price</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`$${this.state.puppyData.price}`}</div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Description</strong></label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{this.state.puppyData.description}</div>
                        </div>
                        {this.getPictures()}
                    </div>
                    {(this.props.hideButtons === false || this.props.hideButtons === undefined) && (
                        <div className="card-footer">
                            <Link to={`/puppy/update/${this.state.puppyId}`} className="btn btn-sm btn-success">Update</Link>
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