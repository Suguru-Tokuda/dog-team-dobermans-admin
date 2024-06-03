import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import MessageList from "./messageList";

class NewMessages extends Component {
  render() {
    const { authenticated } = this.props;

    if (authenticated) {
      return (
        <Route
          path="/messages"
          render={(props) => <MessageList {...props} />}
        />
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  authenticated: state.authenticated,
  loadCount: state.loadCount,
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => dispatch({ type: "SIGN_IN" }),
    logout: () => dispatch({ type: "SIGN_OUT" }),
    setUser: (user) => dispatch({ type: "SET_USER", user: user }),
    unsetUser: () => dispatch({ type: "UNSET_USER" }),
    getUser: () => dispatch({ type: "GET_USER" }),
    showLoading: (params) => dispatch({ type: "SHOW_LOADING", params: params }),
    doneLoading: () => dispatch({ type: "DONE_LOADING" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMessages);
