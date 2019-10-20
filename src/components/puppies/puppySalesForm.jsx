import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppyDetail from './puppyDetail';
import BuyerDetail from '../buyers/buyerDetail';
import BuyerLookupModal from '../buyers/buerLookupModal';
import BuyerRegistrationModal from '../buyers/buyerRegistrationModal';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';

class PuppySalesForm extends Component {
    state = {
        puppyId: '',
        buyerId: '',
        buyer: {},
        puppyDetail: {},
        paymentAmount: '',
        showLookupModal: false,
        showRegisterBuyerModal: false
    };

    constructor(props) {
        super(props);
        this.state.puppyId = props.match.params.puppyId;
    }

    handleBuerSelected = (buyerId) => {
        const { puppyId } = this.state;
        this.setState({ buyerId: buyerId, showLookupModal: false, showRegisterBuyerModal: false });
        this.props.onShowLoading(true, 1);
        PuppiesService.getPuppy(puppyId)
            .then(res => {
                this.setState({ puppyDetail: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in loading puppy data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleLookupBuyerBtnClicked = () => {
        this.setState({ showLookupModal: true, showRegisterBuyerModal: false });
    }

    handleShowBuyerRegistrationModal = () => {
        this.setState({ showLookupModal: false, showRegisterBuyerModal: true });
    }

    handlePaymentAmount = (event) => {
        const { puppyDetail } = this.state;
        let paymentAmount = event.target.value;
        if (paymentAmount.length > 0) {
            paymentAmount = paymentAmount.replace(/\D/g, '');
            if (paymentAmount !== '') {
                paymentAmount = parseInt(paymentAmount);
            }
        }
        if (puppyDetail.price >= paymentAmount) {
            this.setState({ paymentAmount });
        }
    }

    handlePaymentSubmision = () => {
        const { buyerId, puppyDetail, paymentAmount } = this.state;
        if (paymentAmount !== 0) {
            puppyDetail.sold = true;
            puppyDetail.soldDate = new Date();
            puppyDetail.paidAmount = paymentAmount;
            puppyDetail.buyerId = buyerId;
            this.props.onShowLoading(true, 1);
            PuppiesService.updatePuppy(puppyDetail.puppyId, puppyDetail)
                .then(res => {
                    toastr.success('Successfully updated the puppy data');
                    this.props.history.push('/puppies');
                })
                .catch(err => {
                    toastr.error('There was an error in updating puppy data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    render() {
        const { puppyId, buyerId, showLookupModal, showRegisterBuyerModal, paymentAmount, puppyDetail } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h3>Puppy Sales Form</h3>
                                <p>Please select the buyer for the puppy</p>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-inline">
                                            <button className="btn btn-success" onClick={this.handleLookupBuyerBtnClicked}>Lookup Buyer</button>
                                            <Link className="btn btn-secondary ml-2" to="/puppies">Back</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <PuppyDetail puppyId={puppyId} hideButtons={true} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                    </div>
                    {buyerId !== '' && (
                        <div className="col-6">
                            <BuyerDetail buyerId={buyerId} showBackBtn={false} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                            <div className="card">
                                <div className="card-body">
                                    <div className="row form-group">
                                        <label className="col-2"><strong>Price</strong></label>
                                        {puppyDetail.price && (
                                            <div className="col-6">{`$${puppyDetail.price}`}</div>
                                        )}
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-2"><strong>Payment Amount</strong></label>
                                        <div className="col-6">
                                            <input className="form-control" type="text" value={paymentAmount} onChange={this.handlePaymentAmount} />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <div className="col-2">
                                            <button className="btn btn-primary" onClick={this.handlePaymentSubmision}>Submit Payment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <BuyerLookupModal showModal={showLookupModal} onBuyerSelected={this.handleBuerSelected.bind(this)} onShowBuyerRegistrationModal={this.handleShowBuyerRegistrationModal} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                <BuyerRegistrationModal showModal={showRegisterBuyerModal} onBuyerSelected={this.handleBuerSelected.bind(this)} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
            </React.Fragment>
        );
    }
}

export default PuppySalesForm;