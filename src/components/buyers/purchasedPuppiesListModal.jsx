import React, { Component } from 'react';
import PuppiesService from '../../services/puppiesService';
import $ from 'jquery';
import moment from 'moment';
import toastr from 'toastr';

class PurchasedPuppiesModal extends Component {
    state = {
        buyerID: '',
        buyerDetail: {},
        puppies: [],
        updateData: false
    };

    componentDidUpdate() {
        const { updateData, buyerID } = this.state;
        if (updateData === true) {
            this.props.onShowLoading(true, 1);
            PuppiesService.getPuppiesForBuyerID(buyerID)
                .then(res => {
                    this.setState({ puppies: res.data });
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in loading puppies data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.buyerID !== prevState.buyerID) {
            return { 
                buyerID: nextProps.buyerID,
                buyerDetail: nextProps.buyerDetail,
                updateData: true
            };
        }
        return null;
    }

    getTable() {
        const { puppies } = this.state;
        const thead = (
            <thead>
                <tr>
                    <th>PuppyID</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Price</th>
                    <th>Purchase Date</th>
                </tr>
            </thead>
        );
        let tbody;
        if (puppies.length > 0) {
            const rows = puppies.map((puppy, i) => {
                return (
                    <tr key={`puppy-${puppy.puppyID}`}>
                        <td>{puppy.puppyID}</td>
                        <td>{puppy.name}</td>
                        <td>{moment(puppy.dateOfBirth).format('MM/DD/YYYY')}</td>
                        <td>{`$${puppy.price}`}</td>
                        <td>{moment(puppy.soldDate).format('MM/DD/YYYY')}</td>
                    </tr>
                )
            });
            tbody = (
                <tbody>
                    {rows}
                </tbody>
            );
        }
        return (
            <div className="table-responsive">
                <table className="table table-fixed">
                    {thead}
                    {tbody}
                </table>
            </div>
        );
    }

    handleCloseBtnClicked = () => {
        $('#purchasedPuppiesModal').modal('hide');
    }

    render() {
        const { buyerDetail } = this.state;
        return (
            <div className="modal fade" id="purchasedPuppiesModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Puppie(s) purchaed by {`${buyerDetail.firstName} ${buyerDetail.lastName}`}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    {this.getTable()}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button" className="btn btn-secondary" onClick={this.handleCloseBtnClicked}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default PurchasedPuppiesModal;