import React, { Component } from 'react';
import { Checkbox } from 'react-ui-icheck';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';
import moment from 'moment';
import $ from 'jquery';
import WaitListEmailModal from './waitListEmailModal';

class WaitListTable extends Component {
    state = {
        tableData: [],
        filteredData: [],
        displayedData: [],
        waitRequestsToNotify: [],
        paginationInfo: {
            currentPage: 1,
            startIndex: 0,
            endIndex: 0,
            maxPages: 5,
            pageSize: 25,
            totalItems: 0
        },
        sortData: {
            key: 'name',
            orderAcs: false
        },
        checkAll: false,
        gridSearch: '',
        pageSizes: [10, 25, 50],
        updateFilteredData: false,
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.waitRequests.map(waitRequest => { waitRequest.selected = false; return waitRequest; });
        this.state.filteredData = JSON.parse(JSON.stringify(this.state.tableData));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData, updateFilteredData } = this.state;
        if (updateFilteredData === true) {
            let filteredData;    
            if (gridSearch !== '') {
                const tableDataCopy = JSON.parse(JSON.stringify(tableData)).map(waitRequest => { waitRequest.selected = false; return waitRequest });
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(tableDataCopy, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(tableData));
            }
            paginationInfo.totalItems = props.totalItems;
            this.setState({
                filteredData: filteredData,
                paginationInfo: paginationInfo,
                updateDisplayedData: true,
                updateFilteredData: false
            });
        }
        if (updateDisplayedData === true) {
            this.setState({ updateDisplayedData: false });
            this.updateDisplayedData(paginationInfo.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newWaitRequests = JSON.parse(JSON.stringify(nextProps.waitRequests)).map(waitRequest => { waitRequest.selected = false; return waitRequest; });
        const currentTableData = JSON.parse(JSON.stringify(prevState.tableData)).map(waitRequest => { waitRequest.selected = false; return waitRequest; });
        if (JSON.stringify(newWaitRequests) !== JSON.stringify(currentTableData)) {
            return {
                tableData: newWaitRequests,
                updateFilteredData: true
            };
        }
        return null;
    }

    updateDisplayedData = (currentPage, startIndex, endIndex) => {
        let displayedData;
        const { filteredData, paginationInfo } = this.state;
        if (startIndex !== endIndex) {
            displayedData = filteredData.slice(startIndex, endIndex + 1);
        } else {
            displayedData = filteredData.slice(startIndex, startIndex + 1);
        }
        paginationInfo.currentPage = currentPage;
        paginationInfo.startIndex = startIndex;
        paginationInfo.endIndex = endIndex;
        let counter = 0;
        displayedData.forEach(waitRequest => {
            if (waitRequest.selected === true)
                counter++;
        });
        const checkAll = counter === displayedData.length;
        this.setState({
            paginationInfo: paginationInfo,
            displayedData: displayedData,
            checkAll: checkAll
        });
    }

    sortTable = (accessor) => {
        const { filteredData, sortData, paginationInfo } = this.state;
        const tableData = SortService.sortDisplayedData(filteredData, accessor, sortData, paginationInfo.startIndex, paginationInfo.endIndex);
        this.setState({
            filteredData: tableData.filteredData,
            displayedData: tableData.displayedData,
            sortData: tableData.sortData
        });
    }

    getPageSizeOptions() {
        const pageSizeOptions = this.state.pageSizes.map(pageSize => 
            <option key={pageSize}>{pageSize}</option>
        );
        return (
                <div className="form-inline">
                    Page size:
                    <select value={this.state.paginationInfo.pageSize} className="form-control" onChange={this.handlePageSizeChanged}>
                        {pageSizeOptions}
                    </select>
                </div>
        );
    }

    getPagination() {
        const { tableData, paginationInfo } = this.state;
        if (tableData.length > 0) {
            return <Pagination
                    onPageChange={this.updateDisplayedData.bind(this)}
                    currentPage={paginationInfo.currentPage}
                    totalItems={paginationInfo.totalItems}
                    maxPages={paginationInfo.maxPages}
                    pageSize={paginationInfo.pageSize}
                    />;
        }
    }

    getSortIcon(accessor) {
        const { sortData } = this.state;
        let sortIcon = '';
        if (accessor === sortData.key) {
            sortIcon = sortData.orderAsc === true ? <span className="fa fa-sort-asc" /> : <span className="fa fa-sort-desc" />;
        }
        return sortIcon;
    }

    getTable() {
        const { displayedData, gridSearch, checkAll } = this.state;
        const thead = (
            <thead>
                <tr>
                    <th className="text-center">
                        {displayedData.length > 0 && (
                            <Checkbox checkboxClass="icheckbox_square-blue" increaseArea="-100%" checked={checkAll} onChange={this.handleAllCheckChanged} label=" " />
                        )}
                    </th>
                    <th>Wait Request ID</th>
                    <th className="pointer" onClick={() => this.sortTable('firstName')}>First Name {this.getSortIcon('firstName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('lastName')}>Last Name {this.getSortIcon('lastName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('email')}>Email {this.getSortIcon('email')}</th>
                    <th className="pointer" onClick={() => this.sortTable('phone')}>Phone {this.getSortIcon('phone')}</th>
                    <th className="pointer" onClick={() => this.sortTable('color')}>Color {this.getSortIcon('color')}</th>
                    <th>Message</th>
                    <th className="pointer" onClick={() => this.sortTable('created')}>Created {this.getSortIcon('created')}</th>
                    <th className="pointer" onClick={() => this.sortTable('notified')}>Last Notified {this.getSortIcon('notified')}</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for wait requests" defaultValue={gridSearch} onChange={this.handleGridSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (displayedData.length > 0) {
            const rows = displayedData.map((waitRequest, i ) => 
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
                    <td>{waitRequest.firstName}</td>
                    <td>{waitRequest.lastName}</td>
                    <td>{waitRequest.email}</td>
                    <td>{waitRequest.phone}</td>
                    <td>{waitRequest.color}</td>
                    <td>{waitRequest.message}</td>
                    <td>{waitRequest.created === undefined ? '' : moment(waitRequest.created).format('MM/DD/YYYY hh:mm:ss')}</td>
                    <td>{waitRequest.notified === undefined ? '' : moment(waitRequest.notified).format('MM/DD/YYYY hh:mm:ss')}</td>
                </tr>
            );
            tbody = <tbody>{rows}</tbody>
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
        displayedData.forEach(waitRequest => {
            if (waitRequest.selected === true)
                count++;
        });
        return count;
    }

    handleCheckChanged = (index, e, checked) => {
        const { displayedData, tableData, filteredData } = this.state;
        displayedData[index].selected = checked;
        const waitRequestID = displayedData[index].waitRequestID;
        for (let i = 0, max = tableData.length; i < max; i++) {
            if (tableData[i].waitRequestID === waitRequestID) {
                tableData[i].selected = checked;
            }
        }
        for (let i = 0, max = filteredData.length; i < max; i++) {
            if (filteredData[i].waitRequestID === waitRequestID) {
                filteredData[i].selected = checked;
                break;
            }
        }
        let counter = 0;
        displayedData.forEach(waitRequest => {
            if (waitRequest.selected === true)
            counter++;
        });
        const checkAll = counter === displayedData.length;
        this.setState({ displayedData, tableData, filteredData, checkAll });
    }

    handleAllCheckChanged = (e, checked) => {
        const { tableData, filteredData, displayedData } = this.state;
        for (let i = 0, max = displayedData.length; i < max; i++) {
            displayedData[i].selected = checked;
        }
        const waitRequestIDs = displayedData.map(testimonial => testimonial.waitRequestID);
        for (let i = 0, max = tableData.length; i < max; i++) {
            if (waitRequestIDs.indexOf(tableData[i].waitRequestID) !== -1) {
                tableData[i].selected = checked;
            }
        }
        for (let i = 0, max = filteredData.length; i < max; i++) {
            if (waitRequestIDs.indexOf(filteredData[i].waitRequestID) !== -1) {
                filteredData[i].selected = checked;
            }
        }
        this.setState({ checkAll: checked, tableData: tableData, filteredData: filteredData, displayedData: displayedData });
    }

    handleGridSearch = (input) => {
        this.setState({ girdSearch: input.target.value });
        this.processGridSearch(input.target.value);
    }

    handlePageSizeChanged = (input) => {
        const paginationInfo = this.state.paginationInfo;
        paginationInfo.pageSize = parseInt(input.target.value);
        this.setState({ paginationInfo: paginationInfo });
    }

    handleNotifyBtnClicked = () => {
        const { tableData } = this.state;
        const waitRequestsToNotify = [];
        tableData.forEach(waitRequest => {
            if (waitRequest.selected === true) {
                const waitRequstToNotify = JSON.parse(JSON.stringify(waitRequest));
                delete waitRequestsToNotify.selected;
                waitRequestsToNotify.push(waitRequstToNotify);
            }
        });
        this.setState({ waitRequestsToNotify });
        if ($('#waitListEmailModal').is(':visible') === false) {
            $('#waitListEmailModal').modal('show');
        }
    }

    handleCancelEmailBtnClicked = () => {
        this.setState({ waitRequestsToNotify: [] });
        if ($('#waitListEmailModal').is(':visible') === true) {
            $('#waitListEmailModal').modal('hide');
        }
    }

    processGridSearch = (inputStr) => {
        let filteredData;
        const { tableData, paginationInfo } = this.state;
        if (inputStr !== '') {
            const searchKeywords = inputStr.toLowerCase().trim().split(' ');
            const uniqueKeywords = [];
            searchKeywords.forEach(keyword => {
                if (uniqueKeywords.indexOf(keyword) === -1)
                    uniqueKeywords.push(keyword);
            });
            const tableDataCopy = JSON.parse(JSON.stringify(tableData)).map(waitRequest => { waitRequest.selected = false; return waitRequest; });
            filteredData = this.filterForKeywords(tableDataCopy, searchKeywords);
            this.setState({ tableData: tableDataCopy });
        } else {
            filteredData = this.state.tableData;
        }
        paginationInfo.totalItems = filteredData.length;
        this.setState({ filteredData, paginationInfo });
    }

    filterForKeywords(tableData, searchKeywords) {
        let retVal;
        if (searchKeywords.length > 0) {
            retVal = tableData.filter(waitRequest => {
                let foundCount = 0;
                searchKeywords.forEach(searchKeyword => {
                    if (waitRequest.firstName.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (waitRequest.lastName.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (waitRequest.email.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (waitRequest.color.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (waitRequest.message.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (waitRequest.phone.indexOf(searchKeyword) !== -1)
                        foundCount++;
                });
                return foundCount > 0;
            });
        } else {
            retVal = tableData;
        }
        return retVal;
    }

    render() {
        const buttonDisabled = this.getNumberOfSelectedWaitRequests() === 0;
        const { waitRequestsToNotify } = this.state;
        return (
            <React.Fragment>
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.handleNotifyBtnClicked}>Notify</button>
                                    <button className="btn btn-danger ml-2" disabled={buttonDisabled} onClick={this.handleDeleteBtnClicked}>Delete</button>
                                </div>
                                <div className="col-6">
                                    <div className="float-right">
                                        {this.getPageSizeOptions()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    {this.getTable()}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    {this.getPagination()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <WaitListEmailModal 
                    waitRequests={waitRequestsToNotify} 
                    onSendBtnClicked={this.props.onSendEmailBtnClicked.bind(this)}
                    onCancelBtnClicked={this.handleCancelEmailBtnClicked}
                />
            </React.Fragment>
        );
    }

}

export default WaitListTable;