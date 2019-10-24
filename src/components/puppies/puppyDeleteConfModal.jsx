import React, { Component } from 'react';
import $ from 'jquery';

class PuppyDeleteConfModal extends Component {
    state = {
        puppyID: '',
        puppyDetail: {},
        showModal: false
    };

    constructor(props) {
        super(props);
        this.state.puppyID = props.puppyID;
        this.state.puppyDetail = props.puppyDetail;
    }

    componentDidUpdate() {
        if (this.state.showModal === true) {
            if ($('#puppyDeleteConfModal').is(':visible') === false) {
                $('#puppyDeleteConfModal').modal('show');
            }
        } else {
            $('#puppyDeleteConfModal').modal('hide');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.puppyID !== prevState.puppyID || nextProps.showModal !== prevState.showModal) {
            return {
                puppyID: nextProps.puppyID,
                puppyDetail: nextProps.puppyDetail,
                showModal: nextProps.showModal
            };
        }
        return null;
    }

    render() {
        const { puppyDetail } = this.state;
        return (
            <div className="modal fade" id="puppyDeleteConfModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Delete Confirmation</h3><br />
                            <p>Delete cannot be undone. Please confirm.</p>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Name</strong></label>
                                {puppyDetail.name && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyDetail.name}</div>
                                )}
                            </div>
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Sex</strong></label>
                                {puppyDetail.sex && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyDetail.sex}</div>
                                )}
                            </div>
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Type</strong></label>
                                {puppyDetail.type && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyDetail.type}</div>
                                )}
                            </div>
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Color</strong></label>
                                {puppyDetail.color && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{puppyDetail.color}</div>
                                )}
                            </div>
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Weight</strong></label>
                                {puppyDetail.weight && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`${puppyDetail.weight} lbs`}</div>
                                )}
                            </div>
                            <div className="row form-group">
                                <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Price</strong></label>
                                {puppyDetail.price && (
                                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{`$${puppyDetail.price}`}</div>
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

export default PuppyDeleteConfModal;