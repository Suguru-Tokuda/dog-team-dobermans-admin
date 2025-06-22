import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "react-ui-icheck";
import UtilService from "../../services/utilService";
import SearchService from "../../services/searchService";
import WaitlistService from "../../services/waitlistService";
import DateTimeService from "../../services/dateTimeService";
import Pagination from "../miscellaneous/pagination";
import moment from "moment";
import $ from "jquery";
import WaitListEmailModal from "./waitListEmailModal";
import { connect } from "react-redux";
import toastr from "toastr";
import DateRangeModal from "../common/dateRangeModal";

class WaitListTable extends Component {
  state = {
    tableData: [],
    filteredData: [],
    displayedData: [],
    waitRequestsToNotify: [],
    selectedWaitRequestIDs: [],
    paginationInfo: {
      currentPage: 1,
      startIndex: 0,
      endIndex: 0,
      maxPages: 5,
      pageSize: 25,
      totalItems: 0,
    },
    sortData: {
      key: "created",
      orderAsc: false,
    },
    checkAll: false,
    filterForExpectedPurchaseDate: false,
    expectedPurchaseDateToSearch: null,
    gridSearch: "",
    pageSizes: [10, 25, 50],
    dateRangeOptions: DateTimeService.getDateRangeOptions(),
    dateRangeID: 1,
    startDate: null,
    endDate: null,
    loadedDateRangeData: {
      dateRangeID: null,
      startDate: null,
      endDate: null,
    },
    updateFilteredData: false,
    updateDisplayedData: false,
    doFilterForExpectedPurchaseDate: false,
  };

  constructor(props) {
    super(props);
    this.state.tableData = props.waitRequests.map((waitRequest) => {
      waitRequest.selected = false;
      return waitRequest;
    });
    this.state.displayedData = JSON.parse(JSON.stringify(this.state.tableData));
    this.state.filteredData = JSON.parse(JSON.stringify(this.state.tableData));
    this.state.paginationInfo.totalItems = props.totalItems;

    // access localStorage to get dateRangeID, startDate, endDate. If not found, use the default values
  }

  componentDidUpdate() {
    this.enablePopover();
  }

  enablePopover() {
    $(document).ready(() => {
      $('[data-toggle="popover"]').popover({
        placement: "top",
        trigger: "hover",
      });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newWaitRequests = nextProps.waitRequests;
    const currentTableData = prevState.tableData;

    if (
      JSON.stringify(newWaitRequests) !== JSON.stringify(currentTableData) ||
      nextProps.totalItems !== prevState.paginationInfo.totalItems
    ) {
      const selectedWaitRequestIDs = prevState.selectedWaitRequestIDs;
      let selectCount = 0;
      newWaitRequests.forEach((waitRequest) => {
        if (selectedWaitRequestIDs.indexOf(waitRequest.waitRequestID) !== -1) {
          waitRequest.selected = true;
          selectCount++;
        } else {
          waitRequest.selected = false;
        }
      });

      const { paginationInfo } = prevState;
      paginationInfo.totalItems = nextProps.totalItems;

      return {
        checkAll: selectCount === newWaitRequests.length,
        displayedData: newWaitRequests,
        paginationInfo: paginationInfo,
        loadedDateRangeData: {
          dateRangeID: nextProps.dateRangeID,
          startDate: nextProps.startDate,
          endDate: nextProps.endDate,
        },
      };
    }

    return null;
  }

  updateDisplayedData = (currentPage, startIndex, endIndex, updateList) => {
    const { paginationInfo } = this.state;
    paginationInfo.currentPage = currentPage;
    paginationInfo.startIndex = startIndex;
    paginationInfo.endIndex = endIndex;

    this.setState({
      paginationInfo: paginationInfo,
    });

    /* Fetch data from the api */
    const { sortData, gridSearch } = this.state;
    const { key, orderAsc } = sortData;
    const dateRange = this.getSelectedDateRange();
    const selectedStartDate = dateRange.startDate;
    const selectedEndDate = dateRange.endDate;

    if (updateList)
      this.props.onUpdateList(
        selectedStartDate,
        selectedEndDate,
        startIndex,
        endIndex,
        key,
        !orderAsc,
        gridSearch
      );
  };

  getPopoverContentForLastMessageFromUser = (waitRequest) => {
    if (
      waitRequest.lastMessageFromUser &&
      waitRequest.lastMessageFromUser.messageBody
    ) {
      return waitRequest.lastMessageFromUser.messageBody;
    } else {
      return null;
    }
  };

  sortTable = (accessor) => {
    const { paginationInfo, sortData, gridSearch, startDate, endDate } =
      this.state;

    if (sortData.key === accessor) {
      sortData.orderAsc = !sortData.orderAsc;
    } else {
      sortData.key = accessor;
      sortData.orderAsc = true;
    }

    this.setState({ sortData });
    this.props.onUpdateList(
      startDate,
      endDate,
      paginationInfo.startIndex,
      paginationInfo.endIndex,
      accessor,
      !sortData.orderAsc,
      gridSearch
    );
  };

  handleDateRangeSelected = (dateRange) => {
    if (dateRange.startDate && dateRange.endDate) {
      this.setState({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
  };

  handleDateRangeOptionSelected = (event) => {
    const dateRangeID = parseInt(event.target.value);

    this.setState({
      dateRangeID: dateRangeID,
    });

    if (dateRangeID === 6) {
      // open modal to choose date range
      if ($("#dateRangeModal").is(":visible") === false) {
        $("#dateRangeModal").modal({ backdrop: "static", keyboard: false });
        $("#dateRangeModal").modal("show");
      }
    } else {
      const dateRange = DateTimeService.getDateRangeByID(dateRangeID);

      this.setState({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
  };

  getDateRangeOptions = () => {
    let selectedLabel = "";
    const selectedDateRangeOption = this.state.dateRangeOptions.filter(
      (option) => option.id === this.state.dateRangeID
    )[0];

    if (this.state.dateRangeID !== 6) {
      selectedLabel = selectedDateRangeOption.label;
    } else {
      if (this.state.startDate && this.state.endDate) {
        selectedLabel = `${moment(this.state.startDate).format(
          "MM/DD/YYYY"
        )}-${moment(this.state.endDate).format("MM/DD/YYYY")}`;
      }
    }

    const dateRangeOptions = this.state.dateRangeOptions.map((option) => {
      let optionLabel = option.label;

      if (option.id === 6 && this.state.dateRangeID === option.id) {
        if (this.state.startDate && this.state.endDate) {
          optionLabel = `${option.label}: ${moment(this.state.startDate).format(
            "MM/DD/YYYY"
          )}-${moment(this.state.endDate).format("MM/DD/YYYY")}`;
        }
      }
      return (
        <option key={option.id} value={option.id}>
          {optionLabel}
        </option>
      );
    });

    return (
      <div className="input-group input-group-sm">
        <select
          value={this.state.dateRangeID}
          className="form-control"
          onChange={this.handleDateRangeOptionSelected.bind(this)}
          style={{ display: "inline-block" }}
        >
          {dateRangeOptions}
        </select>
      </div>
    );
  };

  getPageSizeOptions() {
    const pageSizeOptions = this.state.pageSizes.map((pageSize) => (
      <option key={pageSize}>{pageSize}</option>
    ));
    return (
      <div className="input-group input-group-sm">
        <select
          value={this.state.paginationInfo.pageSize}
          className="form-control"
          onChange={this.handlePageSizeChanged}
          style={{ display: "inline-block" }}
        >
          {pageSizeOptions}
        </select>
      </div>
    );
  }

  getPagination() {
    const { tableData, paginationInfo } = this.state;
    if (tableData.length > 0) {
      return (
        <Pagination
          onPageChange={this.updateDisplayedData.bind(this)}
          currentPage={paginationInfo.currentPage}
          totalItems={paginationInfo.totalItems}
          maxPages={paginationInfo.maxPages}
          pageSize={paginationInfo.pageSize}
        />
      );
    }
  }

  getSortIcon(accessor) {
    const { sortData } = this.state;
    let sortIcon = "";
    if (accessor === sortData.key) {
      sortIcon =
        sortData.orderAsc === true ? (
          <span className="fa fa-sort-asc" />
        ) : (
          <span className="fa fa-sort-desc" />
        );
    }
    return sortIcon;
  }

  getTable() {
    const { displayedData, gridSearch, checkAll } = this.state;

    const thead = (
      <thead>
        <tr>
          <th
            className="text-center"
            data-toggle="tooltip"
            data-placement="top"
            title="Select/Unselect All"
          >
            {displayedData.length > 0 && (
              <Checkbox
                checkboxClass="icheckbox_square-blue"
                increaseArea="-100%"
                checked={checkAll}
                onChange={this.handleAllCheckChanged}
                label=" "
              />
            )}
          </th>
          <th>Wait Request ID</th>
          <th>Puppy ID</th>
          <th className="pointer" onClick={() => this.sortTable("firstName")}>
            First Name {this.getSortIcon("firstName")}
          </th>
          <th className="pointer" onClick={() => this.sortTable("lastName")}>
            Last Name {this.getSortIcon("lastName")}
          </th>
          <th className="pointer" onClick={() => this.sortTable("email")}>
            Email {this.getSortIcon("email")}
          </th>
          <th className="pointer" onClick={() => this.sortTable("phone")}>
            Phone {this.getSortIcon("phone")}
          </th>
          <th className="pointer" onClick={() => this.sortTable("city")}>
            City {this.getSortIcon("city")}
          </th>
          <th className="pointer" onClick={() => this.sortTable("state")}>
            State {this.getSortIcon("state")}
          </th>
          <th>Puppy Name</th>
          <th className="pointer" onClick={() => this.sortTable("color")}>
            Color {this.getSortIcon("color")}
          </th>
          <th>Original Request Message</th>
          <th>Last Message</th>
          <th>Note</th>
          <th className="pointer" onClick={() => this.sortTable("created")}>
            Created {this.getSortIcon("created")}
          </th>
          <th className="pointer" onClick={() => this.sortTable("notified")}>
            Last Notified {this.getSortIcon("notified")}
          </th>
          <th>Actions</th>
        </tr>
        <tr>
          <th colSpan="100%">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search for wait requests"
                defaultValue={gridSearch}
                value={gridSearch}
                onChange={this.handleGridSearch}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={this.handleSearchBtnClicked}
                >
                  Search
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={this.handleClearSearchBtnClicked}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
            </div>
          </th>
        </tr>
      </thead>
    );
    let tbody;
    if (displayedData.length > 0) {
      const rows = displayedData.map((waitRequest, i) => (
        <tr key={`waitRequest-${i}`}>
          <td className="text-center">
            <Checkbox
              checkboxClass="icheckbox_square-blue"
              increaseArea="-100%"
              checked={waitRequest.selected}
              onChange={this.handleCheckChanged.bind(this, i)}
              label=" "
            />
          </td>
          <td>{waitRequest.waitRequestID}</td>
          <td>
            {waitRequest.puppyID && (
              <Link to={`/puppy/view/${waitRequest.puppyID}`}>
                {waitRequest.puppyID}
              </Link>
            )}
          </td>
          <td>{waitRequest.firstName}</td>
          <td>{waitRequest.lastName}</td>
          <td>{waitRequest.email}</td>
          <td>
            <a href={`tel:${waitRequest.phone}`}>{waitRequest.phone}</a>
          </td>
          <td>{waitRequest.city && waitRequest.city}</td>
          <td>{waitRequest.state && waitRequest.state}</td>
          <td>{waitRequest.puppyName && waitRequest.puppyName}</td>
          <td>
            {waitRequest.color !== undefined &&
            waitRequest.color !== null &&
            waitRequest.color !== ""
              ? waitRequest.color
              : "No preference"}
          </td>
          <td data-toggle="popover" data-content={waitRequest.message}>
            {UtilService.shortenStr(waitRequest.message, 10)}
          </td>
          <td
            data-toggle="popover"
            data-content={this.getPopoverContentForLastMessageFromUser(
              waitRequest
            )}
          >
            {UtilService.shortenStr(
              this.getPopoverContentForLastMessageFromUser(waitRequest),
              10
            )}
          </td>
          <td data-toggle="popover" data-content={waitRequest.note}>
            {UtilService.shortenStr(waitRequest.note, 10)}
          </td>
          <td>
            {waitRequest.created === undefined
              ? ""
              : moment(waitRequest.created).format("MM/DD/YYYY hh:mm:ss")}
          </td>
          <td>
            {waitRequest.notified === undefined || waitRequest.notified === null
              ? "N/A"
              : moment(waitRequest.notified).format("MM/DD/YYYY hh:mm:ss")}
          </td>
          <td style={{ whiteSpace: "nowrap" }}>
            {waitRequest.userID && (
              <Link
                type="button"
                className="btn btn-sm btn-success"
                to={`/wait-list/${waitRequest.waitRequestID}`}
                style={{ width: "140px" }}
              >
                <i className="fab fa-facebook-messenger"></i>&nbsp;
                Messages&nbsp;
                {waitRequest.hasUnRepliedMessage === true && (
                  <span
                    className="bade badge-pill badge-success"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Your Turn"
                  >
                    <i
                      className="fas fa-exclamation"
                      style={{ fontSize: "10px" }}
                    ></i>
                  </span>
                )}
                {waitRequest.numberOfUnreadMessages > 0 && (
                  <span className="badge badge-pill badge-success">
                    {waitRequest.numberOfUnreadMessages}
                  </span>
                )}
              </Link>
            )}
            <Link
              type="button"
              className="btn btn-sm btn-success ml-1"
              to={`/wait-list/editor/${waitRequest.waitRequestID}`}
            >
              <i className="fa fa-edit"></i>&nbsp;Edit
            </Link>
          </td>
        </tr>
      ));
      tbody = <tbody>{rows}</tbody>;
    } else {
      tbody = (
        <tbody>
          <tr>
            <th colSpan="100%" className="text-center">
              <h2>
                No requests for the selected search criteria. Adjust date range
                to see more requests.
              </h2>
            </th>
          </tr>
        </tbody>
      );
    }
    return (
      <div className="table-responsive">
        <table className="table table-sm table-striped table-hover">
          {thead}
          {tbody}
        </table>
      </div>
    );
  }

  getNumberOfSelectedWaitRequests() {
    const { displayedData } = this.state;
    let count = 0;
    displayedData.forEach((waitRequest) => {
      if (waitRequest.selected === true) count++;
    });
    return count;
  }

  handleCheckChanged = (index, e, checked) => {
    const { displayedData, selectedWaitRequestIDs } = this.state;

    displayedData[index].selected = checked;
    const waitRequestID = displayedData[index].waitRequestID;
    let selectCounter = 0;

    if (checked) {
      if (
        SearchService.getTargetIndex(selectedWaitRequestIDs, waitRequestID) ===
        -1
      ) {
        const insertIndex = SearchService.getInsertIndex(
          selectedWaitRequestIDs,
          waitRequestID
        );
        selectedWaitRequestIDs.splice(insertIndex, 0, waitRequestID);
      }
    } else {
      const removeIndex = SearchService.getTargetIndex(
        selectedWaitRequestIDs,
        waitRequestID
      );
      if (removeIndex !== -1) selectedWaitRequestIDs.splice(removeIndex, 1);
    }

    displayedData.forEach((request) => {
      if (request.selected) selectCounter++;
    });

    const checkAll = selectCounter === displayedData.length;
    this.setState({ displayedData, selectedWaitRequestIDs, checkAll });
  };

  handleAllCheckChanged = (e, checked) => {
    const { displayedData, selectedWaitRequestIDs } = this.state;

    for (let i = 0, max = displayedData.length; i < max; i++) {
      displayedData[i].selected = checked;
      const waitRequestID = displayedData[i].waitRequestID;

      if (checked) {
        if (
          SearchService.getTargetIndex(
            selectedWaitRequestIDs,
            waitRequestID
          ) === -1
        ) {
          const insertIndex = SearchService.getInsertIndex(
            selectedWaitRequestIDs,
            waitRequestID
          );
          selectedWaitRequestIDs.splice(insertIndex, 0, waitRequestID);
        }
      } else {
        const removeIndex = SearchService.getTargetIndex(
          selectedWaitRequestIDs,
          waitRequestID
        );
        if (removeIndex !== -1) selectedWaitRequestIDs.splice(removeIndex, 1);
      }
    }

    this.setState({
      checkAll: checked,
      displayedData: displayedData,
      selectedWaitRequestIDs: selectedWaitRequestIDs,
    });
  };

  handleSearchBtnClicked = () => {
    const { pageSize } = this.state.paginationInfo;
    const { sortData, gridSearch, startDate, endDate } = this.state;
    const { key, orderAsc } = sortData;
    /* Refresh data and reset pagination. */
    this.props.onUpdateList(
      startDate,
      endDate,
      0,
      pageSize,
      key,
      !orderAsc,
      gridSearch
    );
  };

  handleClearSearchBtnClicked = () => {
    const gridSearch = "";
    const { pageSize } = this.state.paginationInfo;
    const { sortData, startDate, endDate } = this.state;
    const { key, orderAsc } = sortData;

    this.setState({ gridSearch });
    /* Refresh data and reset pagination. */
    this.props.onUpdateList(
      startDate,
      endDate,
      0,
      pageSize,
      key,
      !orderAsc,
      gridSearch
    );
  };

  handleGridSearch = (input) => {
    this.setState({ gridSearch: input.target.value });
  };

  handlePageSizeChanged = (input) => {
    const paginationInfo = this.state.paginationInfo;
    paginationInfo.pageSize = parseInt(input.target.value);
    this.setState({ paginationInfo: paginationInfo });
  };

  handleNotifyBtnClicked = () => {
    const { selectedWaitRequestIDs } = this.state;

    this.props.showLoading({ reset: true, count: 1 });
    WaitlistService.getWaitRequestsByIDs(selectedWaitRequestIDs)
      .then((res) => {
        this.setState({ waitRequestsToNotify: res.data });
        if ($("#waitListEmailModal").is(":visible") === false) {
          $("#waitListEmailModal").modal("show");
        }
      })
      .catch((err) => {
        toastr.error("There was an error in loading wait requests data.");
      })
      .finally(() => {
        this.props.doneLoading({ reset: true });
      });
  };

  handleCancelEmailBtnClicked = () => {
    this.setState({ waitRequestsToNotify: [] });
    if ($("#waitListEmailModal").is(":visible") === true) {
      $("#waitListEmailModal").modal("hide");
      $(".modal-backdrop").remove();
    }
  };

  processGridSearch = (inputStr) => {
    let filteredData;
    const { tableData, paginationInfo } = this.state;
    if (inputStr !== "") {
      const searchKeywords = inputStr.toLowerCase().trim().split(" ");
      const uniqueKeywords = [];
      searchKeywords.forEach((keyword) => {
        if (uniqueKeywords.indexOf(keyword) === -1)
          uniqueKeywords.push(keyword);
      });
      const tableDataCopy = JSON.parse(JSON.stringify(tableData)).map(
        (waitRequest) => {
          waitRequest.selected = false;
          return waitRequest;
        }
      );
      filteredData = this.filterForKeywords(tableDataCopy, searchKeywords);
      this.setState({ tableData: tableDataCopy });
    } else {
      filteredData = this.state.tableData;
    }
    paginationInfo.totalItems = filteredData.length;
    this.setState({ filteredData, paginationInfo });
  };

  filterForKeywords(tableData, searchKeywords) {
    let retVal;
    if (searchKeywords.length > 0) {
      retVal = tableData.filter((waitRequest) => {
        let foundCount = 0;
        searchKeywords.forEach((searchKeyword) => {
          if (
            waitRequest.firstName &&
            waitRequest.firstName.toLowerCase().indexOf(searchKeyword) !== -1
          )
            foundCount++;
          if (
            waitRequest.lastName &&
            waitRequest.lastName.toLowerCase().indexOf(searchKeyword) !== -1
          )
            foundCount++;
          if (
            waitRequest.email &&
            waitRequest.email.toLowerCase().indexOf(searchKeyword) !== -1
          )
            foundCount++;
          if (
            waitRequest.color &&
            waitRequest.color.toLowerCase().indexOf(searchKeyword) !== -1
          )
            foundCount++;
          if (
            waitRequest.message &&
            waitRequest.message.toLowerCase().indexOf(searchKeyword) !== -1
          )
            foundCount++;
          if (
            waitRequest.phone &&
            waitRequest.phone.indexOf(searchKeyword) !== -1
          )
            foundCount++;
        });
        return foundCount > 0;
      });
    } else {
      retVal = tableData;
    }
    return retVal;
  }

  filterForExpectedPurchaseDate(tableData, expectedPurchaseDate) {
    if (tableData.length > 0 && expectedPurchaseDate !== null) {
      const startDate = moment(new Date(expectedPurchaseDate))
        .subtract(2, "months")
        .startOf("day");
      const endDate = moment(new Date(expectedPurchaseDate))
        .add(2, "months")
        .endOf("day");
      return tableData.filter((waitRequest) => {
        if (
          waitRequest.expectedPurchaseDate !== undefined &&
          waitRequest.expectedPurchaseDate !== null
        )
          return moment(new Date(waitRequest.expectedPurchaseDate)).isBetween(
            startDate,
            endDate
          );
        return false;
      });
    }
  }

  handleDeleteBtnClicked = () => {
    const { selectedWaitRequestIDs } = this.state;

    if (selectedWaitRequestIDs.length > 0) {
      const listUpdateData = this.getListUpdateParams();
      this.props.onDeleteBtnClicked(selectedWaitRequestIDs, listUpdateData);
    }
  };

  handleFilterForExpectedPurchaseDateChanged = (e, checked) => {
    if (checked === false) {
      this.setState({
        filterForExpectedPurchaseDate: checked,
        doFilterForExpectedPurchaseDate: false,
        expectedPurchaseDateToSearch: null,
        updateFilteredData: true,
      });
    } else {
      this.setState({ filterForExpectedPurchaseDate: checked });
    }
  };

  handleSetExpectedPurchaseDate = (expectedPurchaseDateToSearch) => {
    let doFilterForExpectedPurchaseDate = false;
    let updateFilteredData = true;
    if (expectedPurchaseDateToSearch !== null) {
      doFilterForExpectedPurchaseDate = true;
      updateFilteredData = true;
    }
    this.setState({
      expectedPurchaseDateToSearch,
      doFilterForExpectedPurchaseDate,
      updateFilteredData,
    });
  };

  handleLoadBtnClicked = () => {
    // check if the date range has changed from the previous section.
    // if changed, it needs to retrieve pagination information and set the start index to 0

    const {
      paginationInfo,
      sortData,
      gridSearch,
      dateRangeID,
      startDate,
      endDate,
      loadedDateRangeData,
    } = this.state;
    // const { startIndex, endIndex } = paginationInfo;
    const startIndex = 0;
    const endIndex = paginationInfo.pageSize - 1;
    const { key, orderAsc } = sortData;

    const dateRange = this.getSelectedDateRange();
    const selectedStartDate = dateRange.startDate;
    const selectedEndDate = dateRange.endDate;

    if (
      loadedDateRangeData.dateRangeID &&
      loadedDateRangeData.startDate &&
      loadedDateRangeData.endDate &&
      (dateRangeID !== loadedDateRangeData.dateRangeID ||
        (dateRangeID === 6 &&
          (startDate !== loadedDateRangeData.startDate ||
            endDate !== loadedDateRangeData.endDate)))
    ) {
      toastr.error("Please elect date range to search for wait requests.");
    } else {
      // if not changed, use the existing information to load page data
      this.props.onUpdateList(
        dateRange.startDate,
        dateRange.endDate,
        startIndex,
        endIndex,
        key,
        !orderAsc,
        gridSearch,
        selectedStartDate,
        selectedEndDate
      );
    }
  };

  getSelectedDateRange = () => {
    const { dateRangeID, startDate, endDate } = this.state;

    if (dateRangeID !== 6) {
      return DateTimeService.getDateRangeByID(dateRangeID);
    } else {
      return {
        startDate: startDate,
        endDate: endDate,
      };
    }
  };

  getListUpdateParams = () => {
    const { paginationInfo, sortData, gridSearch } = this.state;
    const { startIndex, endIndex } = paginationInfo;
    const { key, orderAsc } = sortData;
    const dateRange = this.getSelectedDateRange();
    const { startDate, endDate } = dateRange;
    const retVal = {
      startDate: startDate,
      endDate: endDate,
      startIndex: startIndex,
      endIndex: endIndex,
      key: key,
      orderDesc: !orderAsc,
      gridSearch: gridSearch,
    };

    return retVal;
  };

  handleSendEmail = (waitRequestIDs, subject, body) => {
    const listUpdateData = this.getListUpdateParams();
    this.props.onSendEmailBtnClicked(
      waitRequestIDs,
      subject,
      body,
      listUpdateData
    );
  };

  render() {
    const buttonDisabled = this.state.selectedWaitRequestIDs.length === 0;
    const { waitRequestsToNotify } = this.state;
    return (
      <React.Fragment>
        <div className="animated fadeIn">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
                  <Link
                    className="btn btn-success btn-sm"
                    to="/wait-list/editor"
                  >
                    Create
                  </Link>
                  <button
                    className="btn btn-primary btn-sm ml-2"
                    disabled={buttonDisabled}
                    onClick={this.handleNotifyBtnClicked}
                  >
                    Notify
                  </button>
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    disabled={buttonDisabled}
                    onClick={this.handleDeleteBtnClicked}
                  >
                    Delete
                  </button>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-12 col-lg-12 col-xl-12">
                  <div className="float-right">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-inline">
                          <div className="form-group">
                            {this.getDateRangeOptions()}
                          </div>
                          <div className="form-group ml-1">
                            {this.getPageSizeOptions()}
                          </div>
                          <div className="form-group ml-1">
                            <button
                              type="button"
                              class="btn btn-primary btn-sm"
                              onClick={this.handleLoadBtnClicked}
                            >
                              Load
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">{this.getTable()}</div>
              </div>
              <div className="row">
                <div className="col-12">{this.getPagination()}</div>
              </div>
            </div>
          </div>
        </div>
        <WaitListEmailModal
          waitRequests={waitRequestsToNotify}
          onSendBtnClicked={this.handleSendEmail.bind(this)}
          onCancelBtnClicked={this.handleCancelEmailBtnClicked}
        />
        <DateRangeModal
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDateRangeSelected={this.handleDateRangeSelected}
        ></DateRangeModal>
      </React.Fragment>
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
    showLoading: (params) => dispatch({ type: "SHOW_LOADING", params: params }),
    doneLoading: () => dispatch({ type: "DONE_LOADING" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaitListTable);
