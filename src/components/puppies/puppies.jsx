import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppyDeleteConfModal from './puppyDeleteConfModal';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';

class Puppies extends Component {
    state = {
        puppyIDToDelete: '',
        puppyToDelete: {},
        showDeleteModal: false,
        puppies: [],
        viewOption: ''
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

    handleViewPuppyBtnClicked = (puppyID) => {
        this.props.history.push(`/puppy/view/${puppyID}`);
    }

    handleUpdatePuppyBtnClicked = (puppyID) => {
        this.props.history.push(`/puppy/update/${puppyID}`);
    }
    
    handleRecordSalesBtnClicked = (puppyID) => {
        this.props.history.push(`/puppy/sales/${puppyID}`);
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
        this.props.onShowLoading(true, 1);
        PuppiesService.updatePuppy(puppyID, puppyToUpdate)
            .then(() => {
                puppies[index] = puppyToUpdate;
                this.setState({ puppies });
            })
            .catch(() => {
                toastr.error('There was an error in updating a puppy');
            })
            .finally(() => {
                this.props.onDoneLoading();
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
            puppyToDelete: puppyToDelete,
            showDeleteModal: true
        });
    }

    handleDeleteCancelBtnClicked = () => {
        this.setState({
            puppyIDToDelete: '',
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
        PuppiesService.deletePuppy(puppyToDelete.puppyID)
            .then(res => {
                toastr.success('Successfully deleted a puppy');
                this.setState({
                    puppyIDToDelete: '',
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
        const { puppyIDToDelete, puppyToDelete, showDeleteModal } = this.state;
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
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default Puppies;