import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentsTable from './parentsTable';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class Parents extends Component {
    state = {
        parents: [],
        selectedParentId: ''
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
        } else {
            retVal = (
                <div className="row">
                    <div className="text-center">
                        <h4>No Records Available</h4>
                    </div>
                </div>
            );
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
        // TODO
    }

    render() {
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
            </React.Fragment>
        )
    }
}

export default Parents;