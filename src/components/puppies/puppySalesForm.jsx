import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppyDetail from './puppyDetail';
import BuyerDetail from '../buyers/buyerDetail';
import BuyerLookupModal from '../buyers/buerLookupModal';
import BuyerRegistrationModal from '../buyers/buyerRegistrationModal';

class PuppySalesForm extends Component {
    state = {
        puppyId: '',
        buyerId: '',
        buyer: {},
        emailForSearch: '',
        paymentAmount: '',
        validations: {
            paymentAmount: ''
        },
        showLookupModal: false,
        showRegisterBuyerModal: false
    };

    constructor(props) {
        super(props);
        this.state.puppyId = props.match.params.puppyId;
    }

    onBuyerSelected = (buyerId) => {
        console.log(buyerId);
        this.setState({ buyerId });
    }

    handleLookupBuyerBtnClicked = () => {
        this.setState({ showLookupModal: true, showRegisterBuyerModal: false });
    }

    handleShowBuyerRegistrationModal = () => {
        this.setState({ showLookupModal: false, showRegisterBuyerModal: true });
    }

    handleSetPaymentAmount = (event) => {
        let paymentAmount = event.target.value;
        const validations = this.state.validations;
        if (paymentAmount.length > 0) {
            paymentAmount = paymentAmount.replace(/\D/g, '');
            if (paymentAmount !== '') {
                validations.price = '';
                paymentAmount = parseInt(paymentAmount);
            } else {
                validations.price = 'Enter price';
            }
        } else {
            paymentAmount = '';
            validations.price = 'Enter price';
        }
        this.setState({ paymentAmount, validations });
    }

    render() {
        const { puppyId, buyerId, showLookupModal, showRegisterBuyerModal, paymentAmount } = this.state;
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
                            <BuyerDetail buyerId={buyerId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                            <div className="card">
                                <div className="card-body">
                                    <div className="row form-group">
                                        <label className="col-xs-12 col-sm-12 col-md-2 col-lg-2"><strong>Payment Amount</strong></label>
                                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3">
                                            <input className="form-control" type="text" value={paymentAmount} onChange={this.handleSetPaymentAmount} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <BuyerLookupModal showModal={showLookupModal} onBuyerSelected={this.onBuyerSelected.bind(this)} onShowBuyerRegistrationModal={this.handleShowBuyerRegistrationModal} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                <BuyerRegistrationModal showModal={showRegisterBuyerModal} onBuyerSelected={this.onBuyerSelected.bind(this)} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
            </React.Fragment>
        );
    }
}

export default PuppySalesForm;