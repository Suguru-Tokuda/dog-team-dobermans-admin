import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppyDeleteConfModal from './puppyDeleteConfModal';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';

class Puppies extends Component {
    state = {
        puppyIdToDelete: '',
        puppyToDelete: {},
        showDeleteModal: false,
        puppies: [],
        viewOption: ''
    }

    componentDidMount() {
        this.getPuppies();
    }

    getPuppies = () => {
        this.props.onShowLoading(true, 1);
        PuppiesService.getAllPuppies()
            .then(res => {
                this.setState({ puppies: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in loading puppies data');
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
                        <h3>Puppies</h3>
                    </div>
                </div>
                <div className="row form-group mt-2">
                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                        <Link className="btn btn-primary" to="/puppy/create/initial-params">Create New Puppy</Link>
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
                 onRecordSalesBtnClicked={this.handleRecordSalesBtnClicked.bind(this)}
                 onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                 onLiveBtnClicked={this.handleLiveBtnClicked.bind(this)}
                 />
            );
        }
    }

    handleViewPuppyBtnClicked = (puppyId) => {
        this.props.history.push(`/puppy/view/${puppyId}`);
    }

    handleUpdatePuppyBtnClicked = (puppyId) => {
        this.props.history.push(`/puppy/update/${puppyId}`);
    }
    
    handleRecordSalesBtnClicked = (puppyId) => {
        this.props.history.push(`/puppy/sales/${puppyId}`);
    }

    handleLiveBtnClicked = (puppyId) => {
        const puppies = JSON.parse(JSON.stringify(this.state.puppies));
        let puppyToUpdate, index;
        puppies.forEach((puppy, i) => {
            if (puppy.puppyId === puppyId) {
                puppyToUpdate = puppy;
                index = i;
            }
        });
        puppyToUpdate.live = !puppyToUpdate.live;
        this.props.onShowLoading(true, 1);
        PuppiesService.updatePuppy(puppyId, puppyToUpdate)
            .then(() => {
                puppies[index] = puppyToUpdate;
                this.setState({ puppies });
            })
            .catch(() => {
                toastr.error('There was an error in');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleDeleteBtnClicked = (puppyId) => {
        const { puppies } = this.state;
        let puppyToDelete;
        puppies.forEach(puppy => {
            if (puppy.puppyId === puppyId)
                puppyToDelete = puppy;
        });
        this.setState({
            puppyIdToDelete: puppyId,
            puppyToDelete: puppyToDelete,
            showDeleteModal: true
        });
    }

    handleDeleteCancelBtnClicked = () => {
        this.setState({
            puppyIdToDelete: '',
            puppyToDelete: {},
            showDeleteModal: false
        });
    }

    handleDoDeleteBtnClicked = async () => {
        const { puppyToDelete } = this.state;
        const pictures = puppyToDelete.pictures;
        this.props.onShowLoading(true, 1);
        if (pictures.length > 0) {
            pictures.forEach(async picture => {
                await PuppiesService.deletePicture(picture.reference);
            });
        }
        PuppiesService.deletePuppy(puppyToDelete.puppyId)
            .then(res => {
                toastr.success('Successfully deleted a puppy');
                this.setState({
                    puppyIdToDelete: '',
                    puppyToDelete: {},
                    showDeleteModal: false
                });
                this.getPuppies();
            })
            .catch(err => {
                toastr.error('There was an error in deleting a puppy');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { puppyIdToDelete, puppyToDelete, showDeleteModal } = this.state;
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
                    puppyId={puppyIdToDelete} 
                    puppyDetail={puppyToDelete} 
                    showModal={showDeleteModal}
                    onCancelBtnClicked={this.handleDeleteCancelBtnClicked.bind(this)}
                    onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked.bind(this)}
                     />
            </React.Fragment>
        )
    }
}

export default Puppies;