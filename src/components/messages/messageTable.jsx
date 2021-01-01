import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PaginationButtons from './paginationButtons';
import moment from 'moment';

class MessageTable extends Component {

    state = {
        messages: [],
        filteredMessages: [],
        messagesDisplayed: [],
        paginationInfo: {
            currentPage: 1,
            starIndex: 0,
            maxPages: 5,
            pageSize: 10,
            totalItems: 0
        },
        updateDisplaedData: false
    };

    constructor(props) {
        super(props);
        this.state.messages = props.messages;
        this.state.paginationInfo.totalItems = props.messages.length;
    }

    componentDidUpdate(props) {
        const { messages, paginationInfo, updateDisplaedData } = this.state;

        if (JSON.stringify(props.messages) !== JSON.stringify(messages)) {
            let filteredMessages;

            filteredMessages = JSON.parse(JSON.stringify(props.messages));

            if (props.messages.length !== paginationInfo.totalItems) {
                paginationInfo.totalItems = props.messages.length;
            }

            this.setState({
                messages: props.messages,
                filteredMessages: filteredMessages,
                paginationInfo: paginationInfo,
                updateDisplayedData: true
            });
        }

        if (updateDisplaedData === true) {
            this.setState({ updateDisplaedData: false });
            this.updateDisplayedData(paginationInfo.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        }
    }

    updateDisplayedData = (currentPage, startIndex, endIndex) => {
        let displayedMessages;
        const { filteredMessages, paginationInfo } = this.state;

        if (startIndex !== endIndex) {
            displayedMessages = filteredMessages.slice(startIndex, endIndex + 1);
        } else {
            displayedMessages = filteredMessages.slice(startIndex, startIndex + 1);
        }

        paginationInfo.currentPage = currentPage;
        paginationInfo.startIndex = startIndex;
        paginationInfo.endIndex = endIndex;

        this.setState({ paginationInfo, displayedMessages });
    }

    renderMessageList() {
        const { messages } = this.state;

        if (messages.length > 0) {
            return messages.map(message => {
                const { sender } = message;
                const pathname = `/wait-list/${message.waitRequestID}`;

                return (
                    <Link key={message.messageID} to={{ pathname: `/wait-list/${message.waitRequestID}`, state: { prevPathname: '/messages'} }} className="c-message">
                        <div className="c-message-details" style={{ width: '100%' }}>
                            <div className="row c-message-headers">
                                    <div className="col-6">
                                        {(sender) && (
                                            <div className="c-message-headers-from">{`${sender.firstName} ${sender.lastName}`}</div>
                                        )}
                                        {(!sender) && (
                                            <div className="c-message-headers-from">{`Bob Johnson`}</div>
                                        )}
                                    </div>
                                    <div className="col-6">
                                        <div className="float-right">
                                            <div className="c-message-headers-date">
                                                {moment(message.sentDate).format('MM/DD/YYYY hh:mm:ss')}    
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="row">
                                <div className="col-12 c-message-body">
                                { message.messageBody }
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            });
        }
    }

    render() {
        const { currentPage, totalItems, maxPages, pageSize } = this.state.paginationInfo;

        return (
            <div className="animated fadeIn">
                <div className="card c-email-app">
                    <div className="card-body">
                        <div className="toolbar mb-4">
                            <div className="btn-group float-right">
                                <PaginationButtons onPageChange={this.updateDisplayedData.bind(this)}
                                                   currentPage={currentPage}
                                                   totalItems={totalItems}
                                                   maxPages={maxPages}
                                                   pageSize={pageSize}
                                 />
                            </div>
                        </div>
                        <div className="c-messages">
                            {this.renderMessageList()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageTable);