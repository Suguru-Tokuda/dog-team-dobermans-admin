import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentDetail from './parentDetail';

class ParentUpdateSelection extends Component {
    state = {
        url: '',
        parentID: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.parentID = props.match.params.parentID;
    }

    render() {
        const { parentID, url } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h4>Update options</h4>
                        <div className="form-inline">
                            <Link className="btn btn-success" to={`${url}/profile/${parentID}`}>Profile</Link>
                            <Link className="btn btn-primary ml-2" to={`${url}/pictures/${parentID}`}>Pictures</Link>
                            <Link className="btn btn-secondary ml-2" to="/parents">Back to Parent List</Link>
                        </div>
                    </div>
                </div>
                <ParentDetail
                    parentID={parentID}
                    onShowLoading={this.props.onShowLoading.bind(this)}
                    onDoneLoading={this.props.onDoneLoading.bind(this)}
                    hideButtons={true} />
            </React.Fragment>
        );
    }
}

export default ParentUpdateSelection;