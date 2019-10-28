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
        puppyID: '',
        buyerID: '',
        buyer: {},
        puppyDetail: {},
        paymentAmount: '',
        showLookupModal: false,
        showRegisterBuyerModal: false
    };

    constructor(props) {
        super(props);
        this.state.puppyID = props.match.params.puppyID;
    }

    componentDidMount() {
        const { puppyID } = this.state;
        this.props.onShowLoading(true, 1);
        PuppiesService.getPuppy(puppyID)
            .then(res => {
                this.setState({ puppyDetail: res.data });
                if (res.data.buyerID !== null || res.data.buyerID !== '') {
                    this.setState({ buyerID: res.data.buyerID });
                }
            })
            .catch(() => {
                toastr.error('There was an error in loading puppy data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            })
    }

    handleBuerSelected = (buyerID) => {
        this.setState({ buyerID: buyerID });
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
        if (puppyDetail.paidAmount === 0 && puppyDetail.price >= paymentAmount) {
            this.setState({ paymentAmount });
        } else if (puppyDetail.paidAmount > 0 && puppyDetail.price - puppyDetail.paidAmount >= paymentAmount) {
            this.setState({ paymentAmount });
        }
    }

    handlePaymentSubmision = () => {
        const { buyerID, puppyDetail, paymentAmount } = this.state;
        if (paymentAmount !== 0) {
            puppyDetail.sold = true;
            puppyDetail.soldDate = new Date();
            puppyDetail.paidAmount = paymentAmount;
            puppyDetail.buyerID = buyerID;
            this.props.onShowLoading(true, 1);
            PuppiesService.updatePuppy(puppyDetail.puppyID, puppyDetail)
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
        const { puppyID, buyerID, showLookupModal, showRegisterBuyerModal, paymentAmount, puppyDetail } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h3>Puppy Sales Form</h3>
                                {(puppyDetail.buyerID === null || puppyDetail.buyerID === '') && (
                                    <React.Fragment>
                                        <p>Please select the buyer for the puppy</p>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-inline">
                                                    <button data-toggle="modal" type="button" data-target="#buyerLookupModal" className="btn btn-success" onClick={this.handleLookupBuyerBtnClicked}>Lookup Buyer</button>
                                                    <Link className="btn btn-secondary ml-2" to="/puppies">Back</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>                                    
                                )}
                                {(puppyDetail.buyerID !== null && puppyDetail.buyerID !== '') && (
                                    <React.Fragment>
                                        <p>Update the sales information.</p>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-inline">
                                                    <Link className="btn btn-secondary" to="/puppies">Back</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        {Object.keys(puppyDetail).length > 0 &&(
                            <PuppyDetail 
                            puppyID={puppyID} 
                            hideButtons={true} 
                            puppyDetail={puppyDetail} 
                            loadDetail={true}
                            onShowLoading={this.props.onShowLoading.bind(this)} 
                            onDoneLoading={this.props.onDoneLoading.bind(this)} />
                        )}
                    </div>
                    {(buyerID !== '' && buyerID !== null) && (
                        <div className="col-6">
                            <BuyerDetail 
                                buyerID={buyerID} 
                                showBackBtn={false}
                                onShowLoading={this.props.onShowLoading.bind(this)} 
                                onDoneLoading={this.props.onDoneLoading.bind(this)} />
                            <div className="card">
                                <div className="card-body">
                                    <div className="row form-group">
                                        <label className="col-2"><strong>Price</strong></label>
                                        {puppyDetail.price && (
                                            <div className="col-6">{`$${puppyDetail.price}`}</div>
                                        )}
                                    </div>
                                    {puppyDetail.paidAmount > 0 && (
                                        <React.Fragment>
                                            <div className="row form-group">
                                                <label className="col-2"><strong>Paid Amount</strong></label>
                                                <div className="col-6">{`$${puppyDetail.paidAmount}`}</div>
                                            </div>
                                            <div className="row form-group">
                                                <label className="col-2"><strong>Amount to pay</strong></label>
                                                <div className="col-6">{`$${puppyDetail.price - puppyDetail.paidAmount}`}</div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    {puppyDetail.price > puppyDetail.paidAmount && ( 
                                        <React.Fragment>
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
                                        </React.Fragment>                                        
                                    )}
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