import React, { Component } from 'react';
import BuyersService from '../../services/buyersService';
import toastr from 'toastr';
import $ from 'jquery';

class BuyerLookupModal extends Component {
    state = {
        searchKeyword: '',
        buyers: [],
        formSubmitted: false,
        showModal: false
    };

    constructor(props) {
        super(props);
        this.state.showModal = props.showModal;
    }

    componentDidUpdate() {
        if (this.state.showModal === true) {
            $('#buyerLookupModal').modal('show');
        } else {
            $('#buyerLookupModal').modal('hide');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.showModal !== prevState.showModal) {
            return { showModal: nextProps.showModal };
        }
        return null;
    }

    getRows = (buyers) => {
        if (buyers.length > 0) {
            return buyers.map(buyer => {
                return (
                    <tr>
                        <td>{buyer.buyerId}</td>
                        <td>{buyer.firstName}</td>
                        <td>{buyer.lastName}</td>
                        <td>{buyer.phone}</td>
                        <td>{buyer.email}</td>
                        <td>{buyer.state}</td>
                        <td>{buyer.city}</td>
                        <td><button className="btn btn-sm btn-success" onClick={() => this.handleSelectBuyerBtnClicked(buyer.buyerId)}>Select</button></td>
                    </tr>
                );
            });
        }
    }

    handleSetSearchKeyword = (e) => {
        const searchKeyword = e.target.value;
        this.setState({ searchKeyword });
    }

    handleSearchBtnClicked = () => {
        const { searchKeyword } = this.state;
        const keywordToSend = searchKeyword.trim();
        this.props.onShowLoading(true, 1);
        BuyersService.searchForBuyers(keywordToSend)
            .then(res => {
                this.setState({ buyers: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in searching for buyers');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { searchKeyword, formSubmitted, buyers } = this.state;
        return (
            <div className="modal fade" id="buyerLookupModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Buyer Lookup Form</h3>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                    <div className="col-7">
                                        <input className="form-control" type="text" value={searchKeyword} onChange={this.handleSetSearchKeyword} placeholder="name, email, phone, state, city..." />
                                        {formSubmitted === true && searchKeyword === '' && (
                                            <span className="text-danger">Enter search word</span>
                                        )}
                                    </div>
                                    <button className="btn btn-sm btn-success col-2" onClick={this.handleSearchBtnClicked}>Search</button>
                                    <button className="btn btn-sm btn-info ml-2 col-2" onClick={this.props.onShowBuyerRegistrationModal}>Create Buyer</button>
                            </div>
                            {buyers.length > 0 && (
                                <div className="row form-group">
                                    <div className="table-responsive">
                                        <table className="table table-sm table-striped">
                                            <thead>
                                                <th>ID</th>
                                                <th>First name</th>
                                                <th>Last name</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>State</th>
                                                <th>City</th>
                                                <th></th>
                                            </thead>
                                            <tbody>
                                                {buyers.length > 0 && (
                                                    this.getRows(buyers)
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BuyerLookupModal;