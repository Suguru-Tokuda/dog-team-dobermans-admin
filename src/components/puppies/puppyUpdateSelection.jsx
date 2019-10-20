import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppyDetail from './puppyDetail';

class PuppyUpdateSelection extends Component {
    state = {
        url: '',
        puppyId: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.puppyId = props.puppyId;
    }

    render() {
        const { puppyId, url } = this.state;
        return (
            <React.Fragment>
            <div className="card">
                <div className="card-body">
                    <h4>Update options</h4>
                    <div className="form-inline">
                        <Link className="btn btn-success" to={`${url}/profile/${puppyId}`}>Profile</Link>
                        <Link className="btn btn-primary ml-2" to={`${url}/pictures/${puppyId}`}>Pictures</Link>
                        <Link className="btn btn-secondary ml-2" to="/puppies">Back to Puppy List</Link>
                    </div>
                </div>
            </div>
            <PuppyDetail puppyId={puppyId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} hideButtons={true} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdateSelection;