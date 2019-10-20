import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentsTable from './parentsTable';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';
import ParentDeleteConfModal from './parentDeleteConfModal';

class Parents extends Component {
    state = {
        parents: [],
        selectedParentId: '',
        showDeleteModal: false,
        parentIdToDelete: '',
        parentToDelete: {}
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        ParentsService.getAllParents()
            .then(res => {
                this.setState({ parents: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in loading parents data');
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
                        <h3>Parents</h3>
                    </div>
                </div>
                <div className="row form-group mt-2">
                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                        <Link className="btn btn-primary" to="/parent/create/initial-params">Create New Parent</Link>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    getParentsTable() {
        let retVal;
        if (this.state.parents.length > 0) {
            retVal = <ParentsTable 
                        parents={this.state.parents}
                        totalItems={this.state.parents.length}
                        onViewBtnClicked={this.handleViewParentBtnClicked.bind(this)}
                        onUpdateBtnClicked={this.handleUpdateParentBtnClicked.bind(this)}
                        onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                    />;
        }
        return retVal;
    }

    handleViewParentBtnClicked = (parentId) => {
        this.props.history.push(`/parent/view/${parentId}`);
    }

    handleUpdateParentBtnClicked = (parentId) => {
        this.props.history.push(`/parent/update/${parentId}`);
    }

    handleDeleteBtnClicked = (parentId) => {
        const { parents } = this.state;
        let parentToDelete;
        parents.forEach(parent => {
            if (parent.parentId === parentId)
                parentToDelete = parent;
        });
        this.setState({
            parentIdToDelete: parentId,
            parentToDelete: parentToDelete,
            showDeleteModal: true
        });
    }

    handleDeleteCancelBtnClicked = () => {
        this.setState({
            parentIdToDelete: '',
            parentToDelete: {},
            showDeleteModal: false
        });
    }

    handleDoDeleteBtnClicked = async () => {
        const { parentToDelete } = this.state;
        const pictures = parentToDelete.pictures;
        this.props.onShowLoading(true, 1);
        if (pictures.length > 0) {
            pictures.forEach(async picture => {
                await ParentsService.deletePicture(picture.refeence);
            });
        }
        ParentsService.deleteParent(parentToDelete.parentId)
            .then(res => {
                toastr.success('Successfully deleted a parent');
                this.setState({
                    puppyIdToDelete: '',
                    puppyToDelete: {},
                    showDeleteModal: false
                });
                this.getParents();
            })
            .catch(err => {
                toastr.error('There was an error in deleting a parent');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }   

    handleLiveBtnClicked = (parentId) => {
        const parents = JSON.parse(JSON.stringify(this.state.parents));
        let parentToUpdate, index;
        parents.forEach((puppy, i) => {
            if (puppy.parentId === parentId) {
                parentToUpdate = puppy;
                index = i;
            }
        });
        parentToUpdate.live = !parentToUpdate.live;
        this.props.onShowLoading(true, 1);
        ParentsService.updateParent(parentId, parentToUpdate)
            .then(() => {
                parents[index] = parentToUpdate;
                this.setState({ parents });
            })
            .catch(() => {
                toastr.error('There was an error in');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        const { parentIdToDelete, parentToDelete, showDeleteModal } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                {this.getHeader()}
                                {this.getParentsTable()}
                            </div>
                        </div>
                    </div>
                </div>
                <ParentDeleteConfModal
                    parentId={parentIdToDelete}
                    parentDetail={parentToDelete}
                    showModal={showDeleteModal}
                    onCancelBtnClicked={this.handleDeleteCancelBtnClicked}
                    onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked}
                />
            </React.Fragment>
        )
    }
}

export default Parents;