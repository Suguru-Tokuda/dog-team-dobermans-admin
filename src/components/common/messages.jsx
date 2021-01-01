import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

class Messages extends Component {
    state = {
        messages: []
    };

    constructor(props) {
        super(props);
        if (props.messages && props.messages.length > 0) {
            this.props.messages = props.messages;
        }
    }

    componentDidUpdate(props) {
        if (JSON.stringify(props.messages) !== JSON.stringify(this.props.messages)) {
            this.setState({
                messages: props.messages
            });
        }
    }

    renderMessageLinks() {
        const { messages } = this.state;

        if (messages.length > 0) {
            const retVal = messages.map(message => {
                const { sender } = message;
                const messageBody = `${message.messageBody}                                                                            `;

                return (
                    <Link key={message.messageID} className="dropdown-item" to={`/wait-list/${message.waitRequestID}`}>
                        <div className="message">
                            <div>
                                <small className="text-muted">{ `${sender.firstName} ${sender.lastName}`}</small>
                                <small className="text-muted float-right mt-1">{ moment(message.sentDate).format('MM/DD/YYYY hh:mm:ss')}</small>
                            </div>
                            <div className="small text-truncate message-dropdown">{messageBody}</div>
                        </div>
                    </Link>
                );
            });

            return retVal;
        }
    }

    render() {
        const { messages } = this.state;
        if (this.props.authenticated) {
            return (
                <li className="c-header-nav-item dropdown d-md-down-none mx-2">
                    <a className="c-header-nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                        <i className="far fa-envelope-open"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right dropdown-menu-lg pt-0">
                        <div className="dropdown-header bg-light">
                            <strong>You have {messages.length} new message{messages.length > 1 ? 's' : ''}</strong>
                        </div>
                        {this.renderMessageLinks()}
                        <Link className="dropdown-item text-center border-top" to="/messages">
                            <strong>View all messages</strong>
                        </Link>
                    </div>
                </li>
            );
        } else {
            return null;
        }
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Messages);