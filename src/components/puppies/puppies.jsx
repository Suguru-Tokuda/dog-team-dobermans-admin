import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppyDeleteConfModal from './puppyDeleteConfModal';
import PuppyTransactionCancelationModal from './puppyTransactionCancelationModal';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';
import $ from 'jquery';

class Puppies extends Component {
    state = {
        puppyIDToDelete: '',
        puppyToDelete: {},
        puppyIDToCancelTransaction: '',
        puppyToCancelTransaction: {},
        showDeleteModal: false,
        puppies: [],
        viewOption: ''
    };

    constructor(props) {
        super(props);
        const { authenticated } = props.authenticated;
        if (authenticated === false) {
            props.history.push('/login');
        }
    }

    componentDidMount() {
        if (this.props.authenticated === true)
            this.getPuppies();
    }

    getPuppies = () => {
        this.props.showLoading({ reset: true, count: 1 });
        PuppiesService.getAllPuppies()
            .then(res => {
                this.setState({ puppies: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in loading puppies data');
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
                        <h3>Puppies</h3>
                    </div>
                </div>
                <div className="row form-group mt-2">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Link className="btn btn-primary" to="/puppy/create/initial-params">Create New Puppy</Link>
                        <Link className="btn btn-success ml-2" to="/puppy/puppy-message">Puppy Message</Link>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    getPuppiesTable() {
        if (this.state.puppies.length > 0) {
            return (
                <PuppiesTable
                 puppies={this.state.puppies}
                 totalItems={this.state.puppies.length}
                 onViewBtnClicked={this.handleViewPuppyBtnClicked.bind(this)}
                 onUpdateBtnClicked={this.handleUpdatePuppyBtnClicked.bind(this)}
                 onTransactionBtnClicked={this.handleRecordSalesBtnClicked.bind(this)}
                 onCancelTransactionBtnClicked={this.handleCancelTransactionBtnClicked.bind(this)}
                 onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                 onLiveBtnClicked={this.handleLiveBtnClicked.bind(this)}
                 />
            );
        }
    }

    handleViewPuppyBtnClicked = (puppyID) => {
        this.props.history.push(`/puppy/view/${puppyID}`);
    }

    handleUpdatePuppyBtnClicked = (puppyID) => {
        this.props.history.push(`/puppy/update/${puppyID}`);
    }
    
    handleRecordSalesBtnClicked = (puppyID) => {
        this.props.history.push(`/puppy/sales/${puppyID}`);
    }

    handleCancelTransactionBtnClicked = (puppyID) => {
        const { puppies } = this.state;
        let puppyToCancelTransaction;
        puppies.forEach(puppy => {
            if (puppy.puppyID === puppyID)
                puppyToCancelTransaction = puppy;
        });
        this.setState({
            puppyIDToCancelTransaction: puppyID,
            puppyToCancelTransaction: puppyToCancelTransaction
        });
        $(document).ready(() => {
            $('#puppyTransactionCancelationModal').modal('show');
        })
    }

    handleDoCancelTransactionBtnClicked = () => {
        const { puppyIDToCancelTransaction } = this.state;
        this.props.showLoading({ reset: true, count: 1 });
        PuppiesService.cancelTransaction(puppyIDToCancelTransaction)
            .then(() => {
                toastr.success('Successfully cancelled the transaction');
                $('#puppyTransactionCancelationModal').modal('hide');
                $('.modal-backdrop').remove();
                this.getPuppies();
            })
            .catch(err => {
                toastr.error('There was an error in cancelling the transaction');
            })
            .finally(() => {
                this.props.onDoneLoading(true, 1);
            });
    }

    handleTransactionCancelationCancelBtnClicked = () => {
        this.setState({
            puppyIDToCancelTransaction: '',
            puppyToCancelTransaction: {}
        });
        $('#puppyTransactionCancelationModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    handleLiveBtnClicked = (puppyID) => {
        const puppies = JSON.parse(JSON.stringify(this.state.puppies));
        let puppyToUpdate, index;
        puppies.forEach((puppy, i) => {
            if (puppy.puppyID === puppyID) {
                puppyToUpdate = puppy;
                index = i;
            }
        });
        puppyToUpdate.live = !puppyToUpdate.live;
        this.props.showLoading({ reset: true, count: 1 });
        PuppiesService.updatePuppy(puppyID, puppyToUpdate)
            .then(() => {
                puppies[index] = puppyToUpdate;
                this.setState({ puppies });
            })
            .catch(() => {
                toastr.error('There was an error in updating a puppy');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    handleDeleteBtnClicked = (puppyID) => {
        const { puppies } = this.state;
        let puppyToDelete;
        puppies.forEach(puppy => {
            if (puppy.puppyID === puppyID)
                puppyToDelete = puppy;
        });
        this.setState({
            puppyIDToDelete: puppyID,
            puppyToDelete: puppyToDelete
        });
        $(document).ready(() => {
            $('#puppyDeleteConfModal').modal('show');
        });
    }

    handleDeleteCancelBtnClicked = () => {
        this.setState({
            puppyIDToDelete: '',
            puppyToDelete: {}
        });
        $('#puppyDeleteConfModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    handleDoDeleteBtnClicked = async () => {
        const { puppyToDelete } = this.state;
        const pictures = puppyToDelete.pictures;
        this.props.showLoading({ reset: true, count: 1 });
        if (pictures.length > 0) {
            pictures.forEach(async picture => {
                try {
                    await PuppiesService.deletePicture(picture.reference);
                } catch (err) {
                    console.log(err);
                }
            });
        }
        PuppiesService.deletePuppy(puppyToDelete.puppyID)
            .then(() => {
                toastr.success('Successfully deleted a puppy');
                $('#puppyDeleteConfModal').modal('hide');
                $('.modal-backdrop').remove();
                this.setState({
                    puppyIDToDelete: '',
                    puppyToDelete: {}
                });
                this.getPuppies();
            })
            .catch(err => {
                toastr.error('There was an error in deleting a puppy');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    render() {
        const { puppyIDToDelete, puppyToCancelTransaction, puppyToDelete, puppyIDToCancelTransaction, showDeleteModal } = this.state;
        const { authenticated } = this.props;

        if (authenticated === true) {
            return (
                <React.Fragment>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    {this.getHeader()}
                                    {this.getPuppiesTable()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <PuppyDeleteConfModal 
                        puppyID={puppyIDToDelete} 
                        puppyDetail={puppyToDelete} 
                        showModal={showDeleteModal}
                        onCancelBtnClicked={this.handleDeleteCancelBtnClicked.bind(this)}
                        onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked.bind(this)}
                    />
                    <PuppyTransactionCancelationModal
                        puppyID={puppyIDToCancelTransaction}
                        puppyDetail={puppyToCancelTransaction}
                        onCancelBtnClicked={this.handleTransactionCancelationCancelBtnClicked.bind(this)}
                        onDoCancelTransactionBtnClicked={this.handleDoCancelTransactionBtnClicked.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Puppies);