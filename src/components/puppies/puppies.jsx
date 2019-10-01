import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';

class Puppies extends Component {
    state = {
        puppies: [],
        viewOption: ''
    }

    componentDidMount() {
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
        console.log(puppyId);
    }

    render() {
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
            </React.Fragment>
            
        )
    }
}

export default Puppies;