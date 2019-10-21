import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentDetail from './parentDetail';

class ParentUpdateSelection extends Component {
    state = {
        url: '',
        parentId: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.parentId = props.match.params.parentId;
    }

    render() {
        const { parentId, url } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h4>Update options</h4>
                        <div className="form-inline">
                            <Link className="btn btn-success" to={`${url}/profile/${parentId}`}>Profile</Link>
                            <Link className="btn btn-primary ml-2" to={`${url}/pictures/${parentId}`}>Pictures</Link>
                            <Link className="btn btn-secondary ml-2" to="/parents">Back to Parent List</Link>
                        </div>
                    </div>
                </div>
                <ParentDetail
                    parentId={parentId}
                    onShowLoading={this.props.onShowLoading.bind(this)}
                    onDoneLoading={this.props.onDoneLoading.bind(this)}
                    hideButtons={true} />
            </React.Fragment>
        );
    }
}

export default ParentUpdateSelection;