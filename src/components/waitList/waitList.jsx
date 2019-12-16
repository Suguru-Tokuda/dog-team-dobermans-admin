import React, { Component } from 'react';
import WaitListTable from './waitListTable';
import WaitListService from '.../../services/';
import toastr from 'toastr';

class WaitList extends Component {
    state = {
        waitRequests: [],
        loaded: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        WaitListService.getWaitList()
            .then(res => {
                this.setState({ waitRequests: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading wait list data');
            })
            .finally(() => {
                this.props.onDoneLoading();
                this.setState({ loaded: true });
            });
    }

    getTable() {
        const { waitRequests, loaded } = this.state;
        if (loaded === true) {
            if (waitRequests.length > 0) {
                return (
                    <WaitListTable
                    waitRequests={waitRequests}
                    totalItems={waitRequests.length}
                    />
                );
            } else if (waitRequests.length === 0) {
                return <h4>No requests</h4>;
            }
        }
        return null;
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3>Wait List</h3>
                        </div>
                        <div className="card-body">
                            {this.getTable()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}