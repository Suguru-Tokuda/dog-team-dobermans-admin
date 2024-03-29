import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import BuyersTable from './buyersTable';
import UserService from '../../services/userService';
import BuyerRegistrationModal from './buyerRegistrationModal';
import BuyerDeleteConfModal from './buyerDeleteConfModal';
import PurchasedPuppiesListModal from './purchasedPuppiesListModal';
import toastr from 'toastr';
import $ from 'jquery';

class Buyers extends Component {
    state = {
        buyerIDToUpdate: undefined,
        buyerToUpdate: {},
        buyers: [],
        buyerIDToDelete: undefined,
        buyerToDelete: {},
        selectedBuyerForPurchasedPuppies: {},
        selectedBuyerIDForPurchasedPuppies: undefined
    };

    constructor(props) {
        super(props);
        const { authenticated } = props;
        if (authenticated === false) {
            props.history.push('/login');
        }
    }
    
    componentDidMount() {
        if (this.props.authenticated === true)
            this.getUsers();
    }

    getUsers= () => {
        this.props.showLoading({ reset: true, count: 1 });

        UserService.getUsers()
            .then(res => {
                this.setState({ buyers: res.data });
            })
            .catch((err) => {
                toastr.error('There was an error in loading buyers data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    getHeader() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h3>Customers</h3>
                    </div>
                </div>
                {/* <div className="row form-group mt-2">
                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                        <button type="button" data-target="#buyerRegistrationModal" data-toggle="modal" className="btn btn-primary">Create New Buyer</button>
                    </div>
                </div> */}
            </React.Fragment>
        )
    }

    getBuyersTable() {
        const { buyers } = this.state;

        if (buyers && buyers.length > 0) {
            return (
                <BuyersTable
                 buyers={buyers}
                 totalItems={buyers.length}
                 onUpdateBtnClicked={this.handleUpdateBtnClicked.bind(this)}
                 onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                 onSeePurchasedPuppiesBtnClicked={this.handleSeePurchasedPuppiesBtnClicled.bind(this)}
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

    handleDeleteCancelBtnClicked = () => {
        this.setState({ buyerToDelete: {} });
        $('#buyerDeleteConfModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    handleDoDeleteBtnClicked = () => {
        const { buyerToDelete } = this.state;
        this.props.showLoading({ reset: true, count: 1 });
        UserService.deleteUser(buyerToDelete.buyerID)
            .then(() => {
                this.setState({
                    buyerIDToDelete: '',
                    buyerToDelete: {}                    
                });
                toastr.success('Successfully deleted a buyer');
                $('#buyerDeleteConfModal').modal('hide');
                $('.modal-backdrop').remove();
                this.getUsers();
            })
            .catch(() => {
                toastr.error('There was an error in deleting a buyer');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    handleSeePurchasedPuppiesBtnClicled = (buyerID, buyerDetail) => {
        this.setState({
            selectedBuyerIDForPurchasedPuppies: buyerID,
            selectedBuyerForPurchasedPuppies: JSON.parse(buyerDetail)
        });
        $('#purchasedPuppiesModal').modal('show');
    }

    handleBuyerCreated = () => {
        this.getUsers();
    }

    handleBuyerUpdated = () => {
        this.getUsers();
    }

    render() {
        const { buyerIDToUpdate, buyerToUpdate, buyerIDToDelete, buyerToDelete, selectedBuyerIDForPurchasedPuppies, selectedBuyerForPurchasedPuppies } = this.state;
        const { authenticated } = this.props;
        if (authenticated === true) {
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
                     />
                    <BuyerDeleteConfModal
                     buyerID={buyerIDToDelete}
                     buyerToDelete={buyerToDelete}
                     onDeleteCancelBtnClicked={this.handleDeleteCancelBtnClicked}
                     onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked}
                    />
                    <PurchasedPuppiesListModal
                        {...this.props}
                        buyerID={selectedBuyerIDForPurchasedPuppies}
                        buyerDetail={selectedBuyerForPurchasedPuppies}
                    />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
  
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Buyers);