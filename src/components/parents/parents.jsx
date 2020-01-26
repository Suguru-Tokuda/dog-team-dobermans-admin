import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ParentsTable from './parentsTable';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';
import ParentDeleteConfModal from './parentDeleteConfModal';

class Parents extends Component {
    state = {
        parents: [],
        selectedparentID: '',
        showDeleteModal: false,
        parentIDToDelete: '',
        parentToDelete: {}
    }

    constructor(props) {
        super(props);
        const { authenticated } = props;
        if (authenticated === false) {
            props.history.push('/login');
        }
    }

    componentDidMount() {
        if (this.props.authenticated === true) {
            this.loadParents();
        }
    }

    loadParents() {
        this.props.onShowLoading(true, 1);
        ParentsService.getAllParents()
            .then(res => {
                console.log(res.data);
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
                        onLiveBtnClicked={this.handleLiveBtnClicked.bind(this)}
                    />;
        }
        return retVal;
    }

    handleViewParentBtnClicked = (parentID) => {
        this.props.history.push(`/parent/view/${parentID}`);
    }

    handleUpdateParentBtnClicked = (parentID) => {
        this.props.history.push(`/parent/update/${parentID}`);
    }

    handleLiveBtnClicked = (parentID) => {
        const parents = JSON.parse(JSON.stringify(this.state.parents));
        let parentToUpdate, index;
        parents.forEach((parent, i) => {
            if (parent.parentID === parentID) {
                parentToUpdate = parent;
                index = i;
            }
        });
        parentToUpdate.live = !parentToUpdate.live;
        delete parentToUpdate.parentID;
        this.props.onShowLoading(true, 1);
        ParentsService.updateParent(parentID, parentToUpdate)
            .then(() => {
                parentToUpdate.parentID = parentID;
                parents[index] = parentToUpdate;
                this.setState({ parents });
            })
            .catch(() => {
                toastr.error('There was an error in update a parent');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleDeleteBtnClicked = (parentID) => {
        const { parents } = this.state;
        let parentToDelete;
        parents.forEach(parent => {
            if (parent.parentID === parentID)
                parentToDelete = parent;
        });
        this.setState({
            parentIDToDelete: parentID,
            parentToDelete: parentToDelete,
            showDeleteModal: true
        });
    }

    handleDeleteCancelBtnClicked = () => {
        this.setState({
            parentIDToDelete: '',
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
                await ParentsService.deletePicture(picture.reference);
            });
        }
        ParentsService.deleteParent(parentToDelete.parentID)
            .then(res => {
                toastr.success('Successfully deleted a parent');
                this.setState({
                    puppyIDToDelete: '',
                    puppyToDelete: {},
                    showDeleteModal: false
                });
                this.loadParents();
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in deleting a parent');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }   

    render() {
        const { parentIDToDelete, parentToDelete, showDeleteModal } = this.state;
        const { authenticated } = this.props;
        if (authenticated === true) {
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
                        parentID={parentIDToDelete}
                        parentDetail={parentToDelete}
                        showModal={showDeleteModal}
                        onCancelBtnClicked={this.handleDeleteCancelBtnClicked}
                        onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked}
                    />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default Parents;