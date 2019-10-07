import React, { Component } from 'react';
import BuyersService from '../../services/buyersService';
import toastr from 'toastr';

class BuyerDetail extends Component {
    state = {
        buyerId: '',
<<<<<<< HEAD
        buyerDetail: {},
        loadBuyerDetail: false
=======
        buerDetail: {},
        loadBuyer: false,
        showSalesConfBtn: false
>>>>>>> ca3afce29045b189e2efb8c3e7bca89e13c5fc39
    };

    constructor(props) {
        super(props);
        this.state.buyerId = props.buyerId;
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.buyerId !== prevState.buyerId) {
            return {
                buyerId: nextProps.buyerId,
                loadBuyer: true
            };
        }
        return null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.buyerId !== prevState.buyerId) {
            return {
                buyerId: nextProps.buyerId,
                loadBuyerDetail: true
            };
        }
        return null;
    }

    componentDidMount() {
        const { buyerId } = this.state;
        this.props.onShowLoading(true, 1);
        BuyersService.getBuyer(buyerId)
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
<<<<<<< HEAD
        if (this.state.loadBuyerDetail === true) {
            this.setState({ loadBuyerDetail: false });
            const { buyerId } = this.state;
=======
        const { buyerId, loadBuyer } = this.state;
        if (loadBuyer === true) {
            this.setState({ loadBuyer: false });
>>>>>>> ca3afce29045b189e2efb8c3e7bca89e13c5fc39
            this.props.onShowLoading(true, 1);
            BuyersService.getBuyer(buyerId)
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
        const { buyerDetail } = this.state;
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
<<<<<<< HEAD
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Email</strong></label>
                        {buyerDetail.email && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.email}</div>
                        )}
                    </div>
                    <div className="row form-group">
=======
>>>>>>> ca3afce29045b189e2efb8c3e7bca89e13c5fc39
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Phone</strong></label>
                        {buyerDetail.phone && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.phone}</div>
                        )}
                    </div>
                    <div className="row form-group">
<<<<<<< HEAD
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>State</strong></label>
                        {buyerDetail.state && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.state}</div>
=======
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Email</strong></label>
                        {buyerDetail.email && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.email}</div>
>>>>>>> ca3afce29045b189e2efb8c3e7bca89e13c5fc39
                        )}
                    </div>
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>City</strong></label>
                        {buyerDetail.city && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.city}</div>
                        )}
                    </div>
<<<<<<< HEAD
=======
                    <div className="row form-group">
                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>State</strong></label>
                        {buyerDetail.state && (
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">{buyerDetail.state}</div>
                        )}
                    </div>
                </div>
                <div className="card-footer">
                    <button className="btn btn-sm btn-secondary">Back</button>
>>>>>>> ca3afce29045b189e2efb8c3e7bca89e13c5fc39
                </div>
            </div>
        );
    }
}

export default BuyerDetail;