import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import moment from 'moment';

class Puppies extends Component {
    state = {
        puppies: [],
        selectedPuppyId: '',
        viewOption: ''
    }

    componentDidMount() {
        const puppies = [];
        for (let i = 1, max = 30; i < max; i++) {
            puppies.push({
                puppyId: i,
                dateOfBirth: moment().subtract(i, 'day').toDate(),
                name: `Puppy ${i}`,
                sex: (i % 2) === 0 ? 'male' : 'female',
                weight: 10 + i,
                price: 700
            });
        }
        this.setState({ puppies: puppies });
    }

    getHeader() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h3>Puppies</h3>
                    </div>
                </div>
                <div className="row form-group mt-2 ">
                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                        <Link className="btn btn-primary" to="/puppy/create/initial-params">Create New Puppy</Link>
                        <button type="button" className="btn btn-success" onClick={this.props.onShowNotification}>Show Notification</button> 
                    </div>
                </div>
            </React.Fragment>
        );
    };

    getPuppiesTable() {
        if (this.state.selectedPuppyId === '' && this.state.puppies.length > 0) {
            return (
                <PuppiesTable
                 puppies={this.state.puppies}
                 totalItems={this.state.puppies.length}
                 onViewBtnClicked={this.handleViewPuppyBtnClicked.bind(this)}
                 onUpdateBtnClicked={this.handleUpdatePuppyBtnClicked.bind(this)}
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