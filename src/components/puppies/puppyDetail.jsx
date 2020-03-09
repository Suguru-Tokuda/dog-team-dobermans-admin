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
                    if (parent.gender === 'male') {
                        dads.push(parent);
                    } else if (parent.gender === 'female') {
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
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th width="10%">PuppyID</th>
                                        <td width="90%">{puppyID}</td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Name</th>
                                        <td width="90%">
                                            {puppyData.name && (
                                                puppyData.name
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Gender</th>
                                        <td width="90%">
                                            {puppyData.gender && (
                                                puppyData.gender
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Type</th>
                                        <td width="90%">
                                            {puppyData.type && (
                                                puppyData.type
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Color</th>
                                        <td width="90%">
                                            {puppyData.color && (
                                                puppyData.color
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Dad</th>
                                        <td width="90%">
                                            {puppyData.dadID && (
                                                this.getDadName(puppyData.dadID)
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Mom</th>
                                        <td width="90%">
                                            {puppyData.momID && (
                                                this.getMomName(puppyData.momID)
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Weight</th>
                                        <td width="90%">
                                            {puppyData.weight && (
                                                `${puppyData.weight} lb`
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Price</th>
                                        <td width="90%">
                                            {puppyData.price && (
                                                `$${puppyData.price}`
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Description</th>
                                        <td width="90%">
                                            {puppyData.description && (
                                                puppyData.description
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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