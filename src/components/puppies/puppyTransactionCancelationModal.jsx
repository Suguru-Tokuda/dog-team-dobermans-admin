import React, { Component } from 'react';

class TransactionCancelationModal extends Component {
    state = {
        puppyID: '',
        puppyDetail: {}
    };

    constructor(props) {
        super(props);
        this.state.puppyID = props.puppyID;
        this.state.puppyDetail = props.puppyDetail;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.puppyID !== prevState.puppyID) {
            return {
                puppyID: nextProps.puppyID,
                puppyDetail: nextProps.puppyDetail
            };
        }
        return null;
    }

    render() {
        const { puppyDetail } = this.state;
        const { buyer } = puppyDetail;
        return (
            <div className="modal fade" id="puppyTransactionCancelationModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Transaction Cancelation Confirmation</h3><br />
                            <p>Cancelation cannot be undone. Please confirm.</p>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th width="20%">Buyer Name</th>
                                            <td width="80%">
                                                {buyer && (
                                                    `${buyer.firstName} ${buyer.lastName}`
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th width="20%">Puppy Name</th>
                                            <td width="80%">{puppyDetail && (
                                                puppyDetail.name
                                            )}</td>
                                        </tr>
                                        <tr>
                                            <th width="20%">Color</th>
                                            <td width="80%">{puppyDetail && (
                                                puppyDetail.color
                                            )}</td>
                                        </tr>
                                        <tr>
                                            <th width="20%">Price</th>
                                            <td width="80%">{puppyDetail && (
                                                puppyDetail.price
                                            )}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Close</button>
                            <button type="button" className="btn btn-danger" onClick={this.props.onDoCancelTransactionBtnClicked}>Cancel Transaction</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionCancelationModal;