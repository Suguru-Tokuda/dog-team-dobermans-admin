import React, { Component } from 'react';
import { connect } from 'react-redux';
import ParentService from '../../services/parentService';
import toastr from 'toastr';

class ParentDetail extends Component {
    state = {
        parentID: '',
        parentDetail: {},
        loadDetail: true,
        showBackBtn: false
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
        if (typeof props.showBackBtn !== 'undefined') {
            this.state.showBackBtn = props.showBackBtn;
        }
    }

    componentDidMount() {
        const { parentID, loadDetail } = this.state;
        if (loadDetail === true) {
            this.props.showLoading({ reset: true, count: 1 });
            ParentService.getParent(parentID)
                .then(res => {
                    this.setState({ parentDetail: res.data });
                })
                .catch(() => {
                    toastr.error('There was an error in loading parent data');
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
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
        const { parentDetail, showBackBtn } = this.state;
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
                                        <th width="10%">Gender</th>
                                        <td width="90%">
                                            {parentDetail.gender && (
                                                parentDetail.gender
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
                                                `${parentDetail.weight} lb`
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
                {typeof showBackBtn !== 'undefined' && showBackBtn === true && (
                    <div className="card-footer">
                        <button className="btn btn-secondary" onClick={this.props.onBackBtnClicked} >Back</button>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParentDetail);