import React, { Component } from 'react';

class BuyerDeleteConfModal extends Component {
    state = {
        buyerID: '',
        buyerDetail: {}
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.buyerID !== prevState.buyerID) {
            return {
                buyerID: nextProps.buyerID,
                buyerDetail: nextProps.buyerToDelete
            };
        }
        return null;
    }

    render() {
        const { buyerDetail } = this.state;
        return (
            <div className="modal fade" id="buyerDeleteConfModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Delete Confirmation</h3>
                            <p>Delete cannot be undone. Please confirm.</p>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th width="20%">First Name</th>
                                            <td width="80%">
                                                {buyerDetail.firstName && (
                                                    buyerDetail.firstName
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="20%">Last Name</th>
                                            <td width="80%">
                                                {buyerDetail.lastName && (
                                                    buyerDetail.lastName
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="20%">Phone</th>
                                            <td width="80%">
                                                {buyerDetail.phone && (
                                                    buyerDetail.phone
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="20%">Email</th>
                                            <td width="80%">
                                                {buyerDetail.email && (
                                                    buyerDetail.email
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="20%">City</th>
                                            <td width="80%">
                                                {buyerDetail.city && (
                                                    buyerDetail.city
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="20%">State</th>
                                            <td width="80%">
                                                {buyerDetail.state && (
                                                    buyerDetail.state
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.props.onDeleteCancelBtnClicked}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={this.props.onDoDeleteBtnClicked}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BuyerDeleteConfModal;