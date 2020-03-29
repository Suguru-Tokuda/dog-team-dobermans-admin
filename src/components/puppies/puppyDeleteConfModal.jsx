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
            $('.modal-backdrop').remove();
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
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th width="10%">Name</th>
                                            <td width="90%">
                                                {puppyDetail.name && (
                                                    puppyDetail.name
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="10%">Gender</th>
                                            <td width="90%">
                                                {puppyDetail.gender && (
                                                    puppyDetail.gender
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="10%">Type</th>
                                            <td width="90%">
                                                {puppyDetail.type && (
                                                    puppyDetail.type
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="10%">Color</th>
                                            <td width="90%">
                                                {puppyDetail.color && (
                                                    puppyDetail.color
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="10%">Weight</th>
                                            <td width="90%">
                                                {puppyDetail.weight && (
                                                    `${puppyDetail.weight} lb`
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="10%">Price</th>
                                            <td width="90%">
                                                {puppyDetail.price && (
                                                    `$${puppyDetail.price}`
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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