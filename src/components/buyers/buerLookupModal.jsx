import React, { Component } from "react";
import UserService from "../../services/userService";
import toastr from "toastr";
import { connect } from "react-redux";
import $ from "jquery";

class BuyerLookupModal extends Component {
  state = {
    searchKeyword: "",
    buyers: [],
    formSubmitted: false,
  };

  getRows = (buyers) => {
    if (buyers.length > 0) {
      return buyers.map((buyer) => {
        return (
          <tr key={buyer.buyerID}>
            <td>{buyer.buyerID}</td>
            <td>{buyer.firstName}</td>
            <td>{buyer.lastName}</td>
            <td>{buyer.phone}</td>
            <td>{buyer.email}</td>
            <td>{buyer.state}</td>
            <td>{buyer.city}</td>
            <td>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => this.handleBuyerSelected(buyer.buyerID)}
              >
                Select
              </button>
            </td>
          </tr>
        );
      });
    }
  };

  handleSetSearchKeyword = (e) => {
    const searchKeyword = e.target.value;
    this.setState({ searchKeyword });
  };

  handleSearchBtnClicked = () => {
    const { searchKeyword } = this.state;
    let keywordToSend = searchKeyword.trim();
    keywordToSend = keywordToSend.replace(" ", "+");
    if (keywordToSend.length > 0) {
      this.props.showLoading({ reset: true, count: 1 });
      UserService.searchForBuyers(keywordToSend)
        .then((res) => {
          this.setState({ buyers: res.data });
        })
        .catch((err) => {
          console.log(err);
          toastr.error("There was an error in searching for buyers");
        })
        .finally(() => {
          this.props.doneLoading({ reset: true });
        });
    } else {
      toastr.error("Enter keyword to search");
    }
  };

  handleSearchKeywordKeyUp = (e) => {
    if (e.key === "Enter") {
      this.handleSearchBtnClicked();
    }
  };

  handleBuyerSelected = (buyerID) => {
    $("#buyerLookupModal").modal("hide");
    $(".modal-backdrop").remove();
    this.props.onBuyerSelected(buyerID);
  };

  handleCreateBuyerBtnClicked() {
    $("#buyerLookupModal").modal("hide");
    $("#buyerRegistrationModal").modal("show");
  }

  render() {
    const { searchKeyword, formSubmitted, buyers } = this.state;
    return (
      <div
        className="modal fade"
        id="buyerLookupModal"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Buyer Lookup Form</h3>
            </div>
            <div className="modal-body">
              <div className="row form-group">
                <div className="col-7">
                  <input
                    className="form-control"
                    type="text"
                    value={searchKeyword}
                    onChange={this.handleSetSearchKeyword}
                    onKeyUp={this.handleSearchKeywordKeyUp}
                    placeholder="name, email, phone, state, city..."
                  />
                  {formSubmitted === true && searchKeyword === "" && (
                    <span className="text-danger">Enter search word</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-success col-2"
                  onClick={this.handleSearchBtnClicked}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-info ml-2 col-2"
                  onClick={this.handleCreateBuyerBtnClicked}
                >
                  Create Buyer
                </button>
              </div>
              {buyers.length > 0 && (
                <div className="row form-group">
                  <div className="table-responsive">
                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>First name</th>
                          <th>Last name</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>State</th>
                          <th>City</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{buyers.length > 0 && this.getRows(buyers)}</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-sm btn-secondary ml-2 col-2"
                type="button"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyerLookupModal);
