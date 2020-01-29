import React, { Component } from 'react';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';

class BuyersTable extends Component {
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
            key: 'firstName',
            orderAsc: false
        },
        gridSearch: '',
        pageSizes: [10, 25, 50],
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.buyers;
        this.state.filteredData = JSON.parse(JSON.stringify(props.buyers));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        if (JSON.stringify(tableData) !== JSON.stringify(props.buyers) || props.totalItems !== paginationInfo.totalItems) {
            let filteredData;
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(props.buyers, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(props.buyers));
            }
            if (props.totalItems !== paginationInfo.totalItems)
                paginationInfo.totalItems = props.totalItems;
            this.setState({
                tableData: props.buyers,
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
        const { filteredData, paginationInfo } = this.state;
        let displayedData;
        if (startIndex !== endIndex) {
            displayedData = filteredData.slice(startIndex, endIndex + 1);
        } else {
            displayedData = filteredData.slice(startIndex, startIndex + 1);
        }
        paginationInfo.currentPage = currentPage;
        paginationInfo.startIndex = startIndex;
        paginationInfo.endIndex = endIndex;
        this.setState({ displayedData, paginationInfo });
    }

    sortTable = (accessor) => {
        const { filteredData, sortData, paginationInfo } = this.state;
        const tableData = SortService.sortDisplayedData(
            filteredData,
            accessor,
            sortData,
            paginationInfo.startIndex,
            paginationInfo.endIndex
        );
        this.setState({ filteredData: tableData.filteredData, displayedData: tableData.displayedData, sortData: tableData.sortData });
    }

    getPageSizeOptions() {
        const { pageSizes, paginationInfo } = this.state;
        const pageSizeOptions = pageSizes.map(pageSize => 
            <option key={pageSize}>{pageSize}</option>
        );
        return (
            <div className="form-inline">
                Page size:
                <select value={paginationInfo.pageSize} className="form-control" onChange={this.handlePageSizeChanged}>
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
                    />
        }
    }

    getSortIcon(accessor) {
        const { sortData } = this.state;
        let sortIcon = null;
        if (accessor === sortData.key) {
            sortIcon = sortData.orderAsc === true ? <span className="fa fa-sort-asc" /> : <span className="fa fa-sort-desc" />;
        }
        return sortIcon;
    }

    getTable() {
        const { displayedData, gridSearch } = this.state;
        const thead = (
            <thead>
                <tr>
                    <th className="pointer" onClick={() => this.sortTable('firstName')}>First Name {this.getSortIcon('firstName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('lastName')}>Last Name {this.getSortIcon('lastName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('email')}>Email {this.getSortIcon('email')}</th>
                    <th className="pointer" onClick={() => this.sortTable('phone')}>Phone {this.getSortIcon('phone')}</th>
                    <th className="pointer" onClick={() => this.sortTable('city')}>City {this.getSortIcon('city')}</th>
                    <th className="pointer" onClick={() => this.sortTable('state')}>State {this.getSortIcon('state')}</th>
                    <th>Action</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for buyers" defaultValue={gridSearch} onKeyUp={this.handleGridSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (displayedData.length > 0) {
            const rows = displayedData.map(buyer => {
                return (
                    <tr key={`buyer-${buyer.buyerID}`}>
                        <td>{buyer.firstName}</td>
                        <td>{buyer.lastName}</td>
                        <td>{buyer.email}</td>
                        <td>{buyer.phone}</td>
                        <td>{buyer.city}</td>
                        <td>{buyer.state}</td>
                        <td>
                            <button type="button" className="btn btn-sm btn-primary"><i className="fa fa-search"></i> View</button>
                            {buyer.puppyIDs.length > 0 && (
                                <button type="button" className="btn btn-sm btn-success ml-1" onClick={() => this.props.onSeePurchasedPuppiesBtnClicked(buyer.buyerID, JSON.stringify(buyer))}><i className="fas fas fa-dog"></i> Purchased Dogs</button>
                            )}
                            <button type="button" className="btn btn-sm btn-primary ml-1" onClick={() => this.props.onUpdateBtnClicked(buyer.buyerID)}><i className="fa fa-edit"></i> Update</button>
                            {/* <button type="button" className="btn btn-sm btn-danger ml-1" onClick={() => this.props.onDeleteBtnClicked(buyer.buyerID)}><i className="fa fa-close"></i> Delete</button> */}
                        </td>
                    </tr>
                );
            });
            tbody = <tbody>{rows}</tbody>;
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

    handleGridSearch = (input) => {
        this.processGridSearch(input.target.value);
        this.setState({ gridSearch: input.target.value });
    }

    handlePageSizeChanged = (input) => {
        const paginationInfo = this.state.paginationInfo;
        paginationInfo.pageSize = parseInt(input.target.value);
        this.setState({ paginationInfo: paginationInfo });
    }

    processGridSearch = (inputStr) => {
        const { tableData, paginationInfo } = this.state;
        let filteredData;
        if (inputStr !== '') {
            const searchKeywords = inputStr.toLowerCase().trim().split(' ');
            const uniqueKeywords = [];
            searchKeywords.forEach(keyword => {
                if (uniqueKeywords.indexOf(keyword) === -1)
                    uniqueKeywords.push(keyword);
            });
            filteredData = this.filterForKeywords(tableData, searchKeywords);
        } else {
            filteredData = tableData;
        }
        paginationInfo.totalItems = filteredData.length;
        this.setState({ filteredData, paginationInfo });
    }

    filterForKeywords(tableData, searchKeywords) {
        let retVal;
        if (searchKeywords.length > 0) {
            retVal = tableData.filter(buyer => {
                let foundCount = 0;
                searchKeywords.forEach(searchKeyword => {
                    if (buyer.firstName.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (buyer.lastName.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (buyer.email.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (buyer.city.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (buyer.state.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                });
                return foundCount > 0;
            })
        } else {
            retVal = tableData;
        }
        return retVal;
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <div className="float-right">
                                    {this.getPageSizeOptions()}
                                </div>
                            </div>
                        </div>
                        <div className="row">
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
        );
    }

}

export default BuyersTable;