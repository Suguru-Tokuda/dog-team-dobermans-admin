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
        emailForSearch: '',
        showLookupModal: false,
        showRegisterBuyerModal: false
    };

    constructor(props) {
        super(props);
        this.state.puppyId = props.match.params.puppyId;
    }

    handleOnBuyerCreated = (buyerId) => {
        this.setState({ buyerId });
    }

    handleLookupBuyerBtnClicked = () => {
        this.setState({ showLookupModal: true, showRegisterBuyerModal: false });
    }

    handleShowBuyerRegistrationModal = () => {
        this.setState({ showLookupModal: false, showRegisterBuyerModal: true });
    }

    render() {
        const { puppyId, buyerId, showLookupModal, showRegisterBuyerModal } = this.state;
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
                        </div>
                    )}
                </div>
                <BuyerLookupModal showModal={showLookupModal} onBuyerCreated={this.handleOnBuyerCreated.bind(this)} onShowBuyerRegistration={this.handleShowBuyerRegistrationModal} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
                <BuyerRegistrationModal showModal={showRegisterBuyerModal} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
            </React.Fragment>
        );
    }
}

export default PuppySalesForm;