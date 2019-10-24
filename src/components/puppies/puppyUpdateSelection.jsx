import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppyDetail from './puppyDetail';

class PuppyUpdateSelection extends Component {
    state = {
        url: '',
        puppyID: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.puppyID = props.puppyID;
    }

    render() {
        const { puppyID, url } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h4>Update options</h4>
                        <div className="form-inline">
                            <Link className="btn btn-success" to={`${url}/profile/${puppyID}`}>Profile</Link>
                            <Link className="btn btn-primary ml-2" to={`${url}/pictures/${puppyID}`}>Pictures</Link>
                            <Link className="btn btn-secondary ml-2" to="/puppies">Back to Puppy List</Link>
                        </div>
                    </div>
                </div>
                <PuppyDetail 
                    puppyID={puppyID} 
                    onShowLoading={this.props.onShowLoading.bind(this)} 
                    onDoneLoading={this.props.onDoneLoading.bind(this)} 
                    hideButtons={true} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdateSelection;