import React, { Component } from 'react';
import PuppiesTable from './puppiesTable';
import PuppyFormEditor from './puppyFormEditor';
import moment from 'moment';

class Puppies extends Component {
    state = {
        puppies: [],
        selectedPuppyId: '',
        viewOption: ''
    }

    constructor(props) {
        super(props);
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
                        <button className="btn btn-primary" onClick={this.handleCreateNewPuppyBtnClicked}>Create New Puppy</button>
                    </div>
                </div>
            </React.Fragment>
        )
    };

    getPuppiesTable() {
        if (this.state.selectedPuppyId === '' && this.state.puppies.length > 0 && this.state.viewOption === '') {
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

    getCreateNewPuppy() {
        if (this.state.selectedPuppyId === '' && this.state.viewOption === 'create') {
            return <PuppyFormEditor />;
        }
    }

    getPuppyDetails() {
        if (this.state.selectedPuppyId !== '' && this.state.viewOption === 'view') {
            return <h1>Puppy Details</h1>;
        }
    }

    getPuppyUpdate() {
        if (this.state.selectedPuppyId !== '' && this.state.viewOption === 'update') {
            return <h1>Update</h1>;
        }
    }

    handleCreateNewPuppyBtnClicked = () => {
        this.setState({
            selectedPuppyId: '',
            viewOption: 'create'
        });
    }

    handleViewPuppyBtnClicked = (puppyId) => {
        this.setState({
            selectedPuppyId: puppyId,
            viewOption: 'view'
        });
    }

    handleUpdatePuppyBtnClicked = (puppyId) => {
        this.setState({
            selectedPuppyId: puppyId,
            viewOption: 'update'
        });
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
                                {this.getCreateNewPuppy()}
                                {this.getPuppyDetails()}
                                {this.getPuppyUpdate()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
            
        )
    }
}

export default Puppies;