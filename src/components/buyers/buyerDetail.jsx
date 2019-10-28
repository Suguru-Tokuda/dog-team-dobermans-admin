import React, { Component } from 'react';
import BuyersService from '../../services/buyersService';
import toastr from 'toastr';

class BuyerDetail extends Component {
    state = {
        buyerID: '',
        buyerDetail: {},
        loadBuyer: false,
        showBackBtn: true
    };

    constructor(props) {
        super(props);
        this.state.buyerID = props.buyerID;
        if (props.showBackBtn !== undefined)
            this.state.showBackBtn = props.showBackBtn;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.buyerID !== prevState.buyerID) {
            return {
                buyerID: nextProps.buyerID,
                loadBuyer: true
            };
        }
        return null;
    }

    componentDidMount() {
        const { buyerID } = this.state;
        this.props.onShowLoading(true, 1);
        BuyersService.getBuyer(buyerID)
            .then(res => {
                this.setState({ buyerDetail: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in loading buyer data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    componentDidUpdate() {
        const { buyerID, loadBuyer } = this.state;
        if (loadBuyer === true) {
            this.setState({ loadBuyer: false });
            this.props.onShowLoading(true, 1);
            BuyersService.getBuyer(buyerID)
                .then(res => {
                    this.setState({ buyerDetail: res.data });
                })
                .catch(err => {
                    toastr.error('There was an error in loading buyer data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    render() {
        const { buyerDetail, showBackBtn } = this.state;
        return (
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th width="10%">First Name</th>
                                    <td width="90%">
                                        {buyerDetail.firstName && (
                                            buyerDetail.firstName
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th width="10%">Last Name</th>
                                    <td width="90%">
                                        {buyerDetail.lastName && (
                                            buyerDetail.lastName
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th width="10%">Phone</th>
                                    <td width="90%">
                                        {buyerDetail.phone && (
                                            buyerDetail.phone
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th width="10%">Email</th>
                                    <td width="90%">
                                        {buyerDetail.email && (
                                            buyerDetail.email
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th width="10%">City</th>
                                    <td width="90%">
                                        {buyerDetail.city && (
                                            buyerDetail.city
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th width="10%">State</th>
                                    <td width="90%">
                                        {buyerDetail.state && (
                                            buyerDetail.state
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {showBackBtn === true && (
                    <div className="card-footer">
                        <button className="btn btn-sm btn-secondary">Back</button>
                    </div>
                )}
            </div>
        );
    }
}

export default BuyerDetail;