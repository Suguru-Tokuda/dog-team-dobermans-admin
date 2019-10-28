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
                    <div className="table-responsive">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th width="10%">Name</th>
                                        <td width="90%">
                                            {parentDetail.name && (
                                                parentDetail.name
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Sex</th>
                                        <td width="90%">
                                            {parentDetail.sex && (
                                                parentDetail.sex
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Type</th>
                                        <td width="90%">
                                            {parentDetail.type && (
                                                parentDetail.type
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Color</th>
                                        <td width="90%">
                                            {parentDetail.color && (
                                                parentDetail.color
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Weight</th>
                                        <td width="90%">
                                            {parentDetail.weight && (
                                                `${parentDetail.weight} lbs`
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th width="10%">Description</th>
                                        <td width="90%">
                                            {parentDetail.description && (
                                                parentDetail.description
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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