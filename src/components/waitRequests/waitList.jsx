import React, { Component } from 'react';
import { connect } from 'react-redux';
import WaitListTable from './waitListTable';
import WaitlistService from '../../services/waitlistService';
import toastr from 'toastr';
import imageCompression from 'browser-image-compression';
import $ from 'jquery';

class WaitList extends Component {
    state = {
        waitRequests: [],
        totalItems: 0,
        loaded: false,
        emailHasSent: false
    };

    constructor(props) {
        super(props);
        const { authenticated } = props;
        if (authenticated === false) {
            props.history.push('/login');
        }
    }

    componentDidMount() {
        if (this.props.authenticated === true) {
            this.updateWaitRequests(0, 25, 'created', true, '');
        }
    }

    updateWaitRequests(startIndex, endIndex, sortField, sortDescending, searchText) {
        if (this.props.authenticated) {
            this.props.showLoading({reset: true, count: 1});

            WaitlistService.getWaitlistByRange(startIndex, endIndex, sortField, sortDescending, searchText)
                .then(res => {
                    const { data } = res;
                    this.setState({
                        waitRequests: data.waitRequests,
                        totalItems: data.totalItems
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.props.doneLoading({reset: true});
                    this.setState({loaded: true});
                })
        }
    }

    getTable() {
        const { waitRequests, loaded, totalItems } = this.state;
        if (loaded === true) {
            if (waitRequests.length > 0) {
                return (
                    <WaitListTable
                        waitRequests={waitRequests}
                        totalItems={totalItems}
                        onUpdateList={this.updateWaitRequests.bind(this)}
                        onSendEmailBtnClicked={this.handleSendEmailBtnClicked.bind(this)}
                        onDeleteBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                    />
                );
            } else if (waitRequests.length === 0) {
                return <h4>No requests</h4>;
            }
        }
        return null;
    }

    handleDeleteBtnClicked = async (waitRequestIDs, startIndex, endIndex, sortField, sortDescending) => {
        if (waitRequestIDs.length > 0) { 
            this.props.showLoading({ reset: true, count: 1 });

            try {
                await WaitlistService.deleteWaitRequests(waitRequestIDs);
                const res = await WaitlistService.getWaitlistByRange(startIndex, endIndex, sortField, sortDescending);

                toastr.success(`Deleted ${waitRequestIDs.length} request${waitRequestIDs.length > 1 ? 's' : ''}`);

                this.setState({
                    waitRequests: res.data.waitRequests,
                    totalItems: res.data.totalItems
                });
            } catch (err) {
                toastr.error('There was an error in deleting wait requests.');
            } finally {
                this.props.doneLoading({ reset: true });
            }
        }
    }

    handleSendEmailBtnClicked = async (waitRequestIDs, subject, body) => {
        this.props.showLoading({ reset: true, count: 1 });
        const regex = /\<img (.*?)>/g;
        let result;
        const files = [];

        while ((result = regex.exec(body)) !== null) {
            const regexForSrc = /src="(.*?)"/;
            const dataURI = regexForSrc.exec(result[1])[1];
            if (dataURI.indexOf('data:image/') !== -1) {
                await fetch(dataURI)
                    .then(async (res) => {
                        await res.blob()
                            .then(async (bloblFile) => {
                                const newFile = new File([bloblFile], subject, { type: 'image/png' });
                                try {
                                    const options = {
                                        maxSizeMB: 1,
                                        maxWidthOrHeight: 1280,
                                        useWebWorker: true
                                    };
                                    const compressedFile = await imageCompression(newFile, options);
                                    const image = await WaitlistService.uploadPicture(compressedFile);
                                    files.push(image);
                                } catch (err) {
                                    toastr.error(err);
                                }
                            });
                    });
            }
        }

        let counter = 0;

        body = body.replace(/\<img (.*?)>/g, (imageTag => {
            const regexForSrc = /src="(.*?)"/;
            const src = regexForSrc.exec(imageTag)[1];
            if (src.indexOf('data:image/') !== -1) {
                imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}"`)
            }
            counter++;
            return imageTag;
        }));

        WaitlistService.notify(waitRequestIDs, subject, body)
            .then(async () => {
                toastr.success('Email sent');
                $('#waitListEmailModal').modal('hide');
                $('.modal-backdrop').remove();
                const res = await WaitlistService.getWaitList();
                this.setState({ waitRequests: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in sending email');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaitList);