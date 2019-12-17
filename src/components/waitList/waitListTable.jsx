import React, { Component } from 'react';
import { Checkbox } from 'react-ui-icheck';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagation';
import moment from 'moment';

class WaitListTable extends Component {
    state = {
        tableData: [],
        filteredData: [],
        displayedData: [],
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
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.waitRequests.map(waitRequest => { waitRequest.selected = false; return waitRequest; });
        this.state.filteredData = JSON.parse(JSON.stringify(this.state.tableData));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        const newWaitRequests = JSON.parse(JSON.stringify(props.waitRequests)).map(waitRequest => { waitRequest.selected = false; return waitRequest; });
        const currentTableData = JSON.parse(JSON.stringify(tableData)).map(waitRequest => { waitRequest.selected = false; return waitRequest; });
        if (JSON.stringify(newWaitRequests) !== JSON.stringify(currentTableData)) {
            let filteredData;    
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(newWaitRequests, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(newWaitRequests));
            }
            paginationInfo.totalItems = props.totalItems;
            this.setState({
                tableData: newWaitRequests,
                filteredData: filteredData,
                paginationInfo: paginationInfo,
                updateDisplayedData: true
            });
        }
        if (updateDisplayedData === true) {
            this.setState({ updateDisplayedData: false });
            this.updateDisplayedData(paginationInfo.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        }
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
            displayedData, displayedData,
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

    getPagination() {
        const { tableData, paginationInfo } = this.state;
        if (tableData.length > 0) {
            return <Pagination
                    onPageChange={this.updateDisplayedData.bind(this)}
                    currentPage={paginationInfo.currentPage}
                    totalItems={paginationInfo.tottalItems}
                    maxPages={paginationInfo.maxPages}
                    pageSize={paginationInfo.pageSize}
                    />
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
                    <th className="text-center"><Checkbox checkboxClass="icheckbox_square-blue" increaseArea="-100%" checked={checkAll} onChange={this.handleAllCheckChanged} lable=" " /></th>
                    <th>Wait Request ID</th>
                    <th className="pointer" onClick={() => this.sortTable('firstName')}>First Name {this.getSortIcon('firstName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('lastName')}>Last Name {this.getSortIcon('lastName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('email')}>Email {this.getSortIcon('email')}</th>
                    <th className="pointer" onClick={() => this.sortTable('phone')}>Phone {this.getSortIcon('phone')}</th>
                    <th className="pointer" onClick={() => this.sortTable('color')}>Color {this.getSortIcon('color')}</th>
                    <th>Message</th>
                    <th className="pointer" onClick={() => this.sortTable('created')}>Created {this.getSortIcon('created')}</th>
                    <th className="pointer" onClick={() => this.sortTable('notified')}>Notified {this.getSortIcon('notified')}</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for wait requests" defaultValue={gridSearch} onKeyUp={this.handleGridSearch} />
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
                         />
                    </td>
                    <td>{waitRequest.waitRequestID}</td>
                    <td>{waitRequest.firstName}</td>
                    <td>{waitRequest.lastName}</td>
                    <td>{waitRequest.email}</td>
                    <td>{waitRequest.phone}</td>
                    <td>{waitRequest.color}</td>
                    <td>{waitRequest.message}</td>
                    <td>{waitRequest.created}</td>
                    <td>{waitRequest.notified}</td>
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
        let checkCounter = 0;
        for (let i = 0, max = tableData.length; i < max; i++) {
            if (tableData[i].waitRequestID === waitRequestID) {
                tableData[i].selected = checked;
            }
            if (tableData[i].selected = true) {
                checkCounter++;
            }
        }
        let checkAll = checkCounter === tableData.length;
        for (let i = 0, max = filteredData.length; i < max; i++) {
            if (filteredData[i].waitRequestID === waitRequestID) {
                filteredData[i].selected = checked;
                break;
            }
        }
        this.setState({ displayedData, tableData, filteredData, checkAll });
    }

    handleAllCheckeChanged = (e, checked) => {
        if (checked === true) {

        }
        this.setState({ checkAll: checked });
    }

    handleGridSearch = (input) => {
        this.processGridSearch(input.target.value);
        this.setState({ girdSearch: input.target.value });
    }

    handlePageSizeChanged = (input) => {
        const paginationInfo = this.state.paginationInfo;
        paginationInfo.pageSize = parseInt(input.target.value);
        this.setState({ paginationInfo: paginationInfo });
    }

    processGridSearch = (inputStr) => {
        let tempTableData;
        const { tableData, paginationInfo } = this.state;
        if (inputStr !== '') {
            const searchKeywords = inputStr.toLowerCase().trim().split(' ');
            const uniqueKeywords = [];
            searchKeywords.forEach(keyword => {
                if (uniqueKeywords.indexOf(keyword) === -1)
                    uniqueKeywords.push(keyword);
            });
            tempTableData = this.filterForKeywords(tableData, searchKeywords);
        } else {
            tempTableData = this.state.tableData;
        }
        paginationInfo.totalItems = tempTableData.length;
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
                    if (waitRequest.create.indexOf(searchKeyword) !== -1)
                        foundCount++;
                });
                return foundCount === searchKeywords.length;
            });
        } else {
            retVal = tableData;
        }
        return retVal;
    }

    render() {
        const buttonDisabled = this.getNumberOfSelectedWaitRequests() === 0;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-primary" disabled={buttonDisabled}>Notify</button>
                                <button className="btn btn-danger ml-2" disabled={buttonDisabled}>Delete</button>
                            </div>
                            <div className="col-6">
                                <div className="float-fighter">
                                    {this.getPageSizeOptions()}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                {this.getTable()}
                            </div>
                        </div>
                        <div className="rowl">
                            <div className="col-12">
                                {this.getPagination()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default WaitListTable;