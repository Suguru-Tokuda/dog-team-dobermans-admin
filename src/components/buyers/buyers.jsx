import React, { Component } from 'react';
import BuyersTable from './buyersTable';
import BuyersService from '../../services/buyersService';
import BuyerRegistrationModal from './buyerRegistrationModal';
import BuyerDeleteConfModal from './buyerDeleteConfModal';
import toastr from 'toastr';
import $ from 'jquery';

class Buyers extends Component {
    state = {
        buyerIDToUpdate: undefined,
        buyerToUpdate: {},
        buyers: [],
        buyerIDToDelete: undefined,
        buyerToDelete: {}
    };
    
    componentDidMount() {
        this.getBuyers();
    }

    getBuyers= () => {
        this.props.onShowLoading(true, 1);
        BuyersService.getBuyers()
            .then(res => {
                const buyers = res.data.map(buyer => {
                    buyer.hasBought = buyer.puppyIDs.length > 0 ? true : false;
                    return buyer;
                });
                this.setState({ buyers });
            })
            .catch(() => {
                toastr.error('There was an error in loading buyers data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getHeader() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h3>Buyers</h3>
                    </div>
                </div>
                <div className="row form-group mt-2">
                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                        <button type="button" data-target="#buyerRegistrationModal" data-toggle="modal" className="btn btn-primary">Create New Buyer</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    getBuyersTable() {
        const { buyers } = this.state;
        if (buyers.length > 0) {
            return (
                <BuyersTable
                 buyers={buyers}
                 totalItems={buyers.length}
                 onUpdateBtnClicked={this.handleUpdateBtnClicked.bind(this)}
                 onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                />
            );
        }
    }

    handleUpdateBtnClicked = (buyerID) => {
        const { buyers } = this.state;
        let buyerToUpdate;
        for (let i = 0, max = buyers.length; i < max; i++) {
            if (buyers[i].buyerID === buyerID) {
                buyerToUpdate = buyers[i];
                break;
            }
        }
        this.setState({ buyerIDToUpdate: buyerToUpdate.buyerID, buyerToUpdate });
        $('#buyerRegistrationModal').modal('show');
    }

    handleDeleteBtnClicked = (buyerID) => {
        const { buyers } = this.state;
        let buyerToDelete;
        for (let i = 0, max = buyers.length; i < max; i++) {
            if (buyers[i].buyerID === buyerID) {
                buyerToDelete = buyers[i];
                break;
            }
        }
        this.setState({ buyerIDToDelete: buyerToDelete.buyerID, buyerToDelete });
        $('#buyerDeleteConfModal').modal('show');
    }

    hanldeDeleteCancelBtnClicked = () => {
        this.setState({ buyerToDelete: {} });
        $('#buyerDeleteConfModal').modal('hide');
    }

    handleDoDeleteBtnClicked = () => {
        const { buyerToDelete } = this.state;
        this.props.onShowLoading(true, 1);
        BuyersService.deleteBuyer(buyerToDelete.buyerID)
            .then(() => {
                this.setState({
                    buyerIDToDelete: '',
                    buyerToDelete: {}                    
                });
                toastr.success('Successfully deleted a buyer');
                $('#buyerDeleteConfModal').modal('hide');
                this.getBuyers();
            })
            .catch(() => {
                toastr.error('There was an error in deleting a buyer');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleBuyerCreated = () => {
        this.getBuyers();
    }

    handleBuyerUpdated = () => {
        this.getBuyers();
    }

    render() {
        const { buyerIDToUpdate, buyerToUpdate, buyerIDToDelete, buyerToDelete } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                {this.getHeader()}
                                {this.getBuyersTable()}
                            </div>
                        </div>
                    </div>
                </div>
                <BuyerRegistrationModal
                 buyerID={buyerIDToUpdate}
                 buyerToUpdate={buyerToUpdate}
                 onBuyerSelected={this.handleBuyerCreated.bind(this)}
                 onBuyerUpdated={this.handleBuyerUpdated}
                 onShowLoading={this.props.onShowLoading.bind(this)} 
                 onDoneLoading={this.props.onDoneLoading.bind(this)} />
                <BuyerDeleteConfModal
                 buyerID={buyerIDToDelete}
                 buyerToDelete={buyerToDelete}
                 onDeleteCancelBtnClicked={this.hanldeDeleteCancelBtnClicked}
                 onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked}
                />
            </React.Fragment>
        )
    }
    
}

export default Buyers;