import React, { Component } from 'react';
import WaitListTable from './waitListTable';
import WaitListService from '../../services/waitListService';
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
                    onSendEmailBtnClicked={this.handleSendEmailBtnClicked.bind(this)}
                    />
                );
            } else if (waitRequests.length === 0) {
                return <h4>No requests</h4>;
            }
        }
        return null;
    }

    handleDeleteBtnClicked = (waitRequestIDs) => {
        this.props.onShowLoading(true, 1);
        WaitListService.deleteWaitRequests(waitRequestIDs)
            .then(async () => {
                const successMessage = waitRequestIDs.length > 1 ? `Successfully deleted ${waitRequestIDs.length} requests` : 'Successfully deleted one request';
                toastr.success(successMessage);
                const res = await WaitListService.getWaitList();
                this.setState({ waitRequests: res.data });
            })
            .catch(() => {
                toastr.error('There was an error ')
            })
            .finally(() => {
                this.props.onDoneLoading();
            })
    }

    handleSendEmailBtnClicked = (waitRequestIDs, subject, body) => {
        this.props.onShowLoading(true, 1);
        WaitListService.sendEmail(waitRequestIDs, subject, body)
            .then(async () => {
                toastr.success('Email sent');
                const res = await WaitListService.getWaitList();
                this.setState({ waitRequests: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in sending email');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
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
        );
    }
}

export default WaitList;