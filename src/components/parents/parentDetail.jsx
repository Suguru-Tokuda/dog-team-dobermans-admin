import React, { Component } from 'react';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class ParentDetail extends Component {
    state = {
        parentID: '',
        parentDetail: {},
        loadDetail: true
    };

    constructor(props) {
        super(props);
        if (typeof props.match !== 'undefined') {
            this.state.parentID = props.match.params.parentID;
        } else {
            this.state.parentID = props.parentID;
        }
        if (typeof props.loadDetail !== 'undefined') {
            this.state.loadDetail = props.loadDetail;
        }
        if (typeof props.parentDetail !== 'undefined') {
            this.state.parentDetail = props.parentDetail;
        }
    }

    componentDidMount() {
        const { parentID, loadDetail } = this.state;
        if (loadDetail === true) {
            this.props.onShowLoading(true, 1);
            ParentsService.getParent(parentID)
                .then(res => {
                    this.setState({ parentDetail: res.data });
                })
                .catch(() => {
                    toastr.error('There was an error in loading parent data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    getPictures = () => {
        const { parentDetail } = this.state;
        if (Object.keys(parentDetail).length > 0) {
            const pictures = parentDetail.pictures;
            if (pictures.length > 0) {
                const pictureCards = pictures.map((picture, i) => {
                    return (
                        <div key={`parent-picture-${i}`} className="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-2">
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

    render() {
        const { parentDetail } = this.state;
        return (
            <div className="card">
                <div className="card-body">
                    <h3 className="mb-3">Parent Info</h3>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Name</strong></label>
                        {parentDetail.name && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.name}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Sex</strong></label>
                        {parentDetail.sex && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.sex}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Type</strong></label>
                        {parentDetail.type && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.type}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Color</strong></label>
                        {parentDetail.color && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.color}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Weight</strong></label>
                        {parentDetail.weight && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`${parentDetail.weight} lbs`}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Description</strong></label>
                        {parentDetail.description && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.description}</div>
                        )}
                    </div>
                    {(parentDetail.pictures && parentDetail.pictures.length > 0) &&
                        this.getPictures()
                    }
                </div>
            </div>
        );
    }
}

export default ParentDetail;