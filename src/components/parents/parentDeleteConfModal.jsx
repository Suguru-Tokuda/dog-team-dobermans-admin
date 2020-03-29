import React, { Component } from 'react';
import $ from 'jquery';

class ParentDeleteConfModal extends Component {
    state = {
        parentID: '',
        parentDetail: {},
        showModal: false
    };

    constructor(props) {
        super(props);
        this.state.parentID = props.parentID;
        this.state.parentDetail = props.parentDetail;
    }

    componentDidUpdate() {
        if (this.state.showModal === true) {
            if ($('#parentDeleteConfModal').is(':visible') === false) {
                $('#parentDeleteConfModal').modal('show');
            }
        } else {
            $('#parentDeleteConfModal').modal('hide');
            $('.modal-backdrop').remove();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.parentID !== prevState.parentID || nextProps.showModal !== prevState.showModal) {
            return {
                parentID: nextProps.parentID,
                parentDetail: nextProps.parentDetail,
                showModal: nextProps.showModal
            };
        }
        return null;
    }

    render() {
        const { parentDetail } = this.state;
        return (
            <div className="modal fade" id="parentDeleteConfModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Delete Confirmation</h3><br />
                            <p>Delete cannot be undone. Please confirm.</p>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Name</strong></label>
                                {parentDetail.name && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.name}</div>
                                )}
                            </div>
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Gender</strong></label>
                                {parentDetail.gender && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.gender}</div>
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
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{parentDetail.weight}</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={this.props.onDoDeleteBtnClicked}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParentDeleteConfModal;