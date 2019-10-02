import React, { Component } from 'react';
import BuyersService from '../../services/buyersService';
import toastr from 'toastr';

class BuyerLookupModal extends Component {
    state = {
        searchKeyword: '',
        buyers: []
    };

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
        const { searchKeyword, buyers } = this.state;
        return (
            <div className="modal fade" id="buyerLookuupModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row form-group">
                                <div className="text-center">
                                    <input type="text" value={searchKeyword} onKeyUp={this.handleSetSearchKeyword} />
                                    <button className="btn btn-sm btn-success" onClick={this.handleSearchBtnClicked}>Search</button>
                                </div>
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