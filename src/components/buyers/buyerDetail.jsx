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
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>First Name</strong></label>
                        {buyerDetail.firstName && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.firstName}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Last Name</strong></label>
                        {buyerDetail.lastName && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.lastName}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Phone</strong></label>
                        {buyerDetail.phone && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.phone}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Email</strong></label>
                        {buyerDetail.email && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.email}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>City</strong></label>
                        {buyerDetail.city && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.city}</div>
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>State</strong></label>
                        {buyerDetail.state && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.state}</div>
                        )}
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