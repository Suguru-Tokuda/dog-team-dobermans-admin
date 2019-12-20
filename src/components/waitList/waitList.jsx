import React, { Component } from 'react';
import WaitListTable from './waitListTable';
import WaitListService from '../../services/waitListService';
import toastr from 'toastr';
import imageCompression from 'browser-image-compression';
import $ from 'jquery';

class WaitList extends Component {
    state = {
        waitRequests: [],
        loaded: false,
        emailHasSent: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        WaitListService.getWaitList()
            .then(res => {
                // const waitRequests = [];
                // const original = JSON.parse(JSON.stringify(res.data[0]));
                // for (let i = 0, max = 50; i < max; i++) {
                //     const copy = JSON.parse(JSON.stringify(original));
                //     copy.waitRequestID = `copy.waitRequestID-${i}`;
                //     waitRequests.push(copy);
                // }
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

    handleSendEmailBtnClicked = async (waitRequestIDs, subject, body) => {
        this.props.onShowLoading(true, 1);
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
                                    const image = await WaitListService.uploadPicture(compressedFile);
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
                imageTag = imageTag.replace(regexForSrc, `src="${files[counter].url}" alt="${files[counter].reference}" /`)
            }
            counter++;
            return imageTag;
        }));
        WaitListService.notify(waitRequestIDs, subject, body)
            .then(async () => {
                toastr.success('Email sent');
                $('#waitListEmailModal').modal('hide');
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