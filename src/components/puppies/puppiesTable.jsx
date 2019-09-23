import React, { Component } from 'react';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';
import moment from 'moment';

class PuppiesTable extends Component {
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
        columns: [
            { header: 'Name', accessor: 'name'},
            { header: 'DOB', accessor: 'dateOfBirth' },
            { header: 'Sex', accessor: 'sex' },
            { header: 'Weight', accessor: 'weight' },
            { header: 'Price', accessor: 'price' },
            { header: 'Picture', accessor: 'picture' }
        ],
        sortData: {
            key: 'name',
            orderAsc: false
        },
        gridSearch: '',
        updateDataFromGridSearch: false,
        pageSizes: [10, 25, 50],
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.puppies;
        this.state.filteredData = JSON.parse(JSON.stringify(props.puppies));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.puppies !== prevState.tableData || nextProps.totalItems !== prevState.paginationInfo.totalItems) {
            const state = prevState;
            let filteredData;
            if (prevState.gridSearch !== '') {
                state.updateDataFromGridSearch = true;
                const searchKeywords = prevState.gridSearch.toLowerCase().trim().split(' ');
                filteredData = PuppiesTable.filterForKeywords(nextProps.puppies, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(nextProps.puppies));
            }
            state.tableData = nextProps.puppies;
            state.filteredData = filteredData;
            if (nextProps.totalItems !== prevState.paginationInfo.totalItems)
                state.paginationInfo.totalItems = nextProps.totalItems;
            return state;
        }
        return null;
    }

    updateDisplayedData = (currentPage, startIndex, endIndex) => {
        let displayedData;
        if (startIndex !== endIndex) {
            displayedData = this.state.filteredData.slice(startIndex, endIndex + 1);
        } else {
            displayedData = this.state.filteredData.slice(startIndex, startIndex + 1);
        }
        const tempPagination = this.state.paginationInfo;
        tempPagination.currentPage = currentPage;
        tempPagination.startIndex = startIndex;
        tempPagination.endIndex = endIndex;
        this.setState({
            paginationInfo: tempPagination,
            displayedData: displayedData
        });
    }

    sortTable = (accessor) => {
        const tableData = SortService.sortDisplayedData(
            this.state.filteredData,
            accessor,
            this.state.sortData,
            this.state.paginationInfo.startIndex,
            this.state.paginationInfo.endIndex
        );
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
            <select value={this.state.paginationInfo.pageSize} className="form-control" onChange={this.handlePageSizeChanged}>
                {pageSizeOptions}
            </select>
        )
    }

    getPagination() {
        if (this.state.tableData.length > 0) {
            return <Pagination
                    onPageChange={this.updateDisplayedData.bind(this)}
                    currentPage={this.state.paginationInfo.currentPage}
                    totalItems={this.state.paginationInfo.totalItems}
                    maxPages={this.state.paginationInfo.maxPages}
                    pageSize={this.state.paginationInfo.pageSize}
                    />;
        }
    }

    getTable() {
        let sortIcon;
        const tHeaders = this.state.columns.map(header => {
            sortIcon = '';
            if (header.accessor === this.state.sortData.key) {
                sortIcon = this.state.sortData.orderAsc === true ? <span className="fa fa-sort-asc" /> : <span className="fa fa-sort-desc" />;
            }
            return <th className="pointer" key={header.header} onClick={() => this.sortTable(header.accessor)}>{header.header} {sortIcon}</th>;
        });
        tHeaders.push(<th key="action">Actions</th>)
        const thead = (
            <thead>
                <tr>{tHeaders}</tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for puppies" defaultValue={this.state.gridSearch} onKeyUp={this.handleGirdSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (this.state.displayedData.length > 0) {
            const rows = this.state.displayedData.map((puppy, i) => {
                return (
                    <tr key={`puppy-${puppy.puppyId}`}>
                        <td>{puppy.name}</td>
                        <td>{moment(puppy.dateOfBirth).format('MM/DD/YYYY')}</td>
                        <td>{puppy.sex}</td>
                        <td>{puppy.weight}</td>
                        <td>{`$${puppy.price}`}</td>
                        <td><img className="rounded" style={{ width: "50px"}} src="http://photos.puppyspot.com/breeds/223/card/500000183_medium.jpg" alt="http://photos.puppyspot.com/breeds/223/card/500000183_medium.jpg" /></td>
                        <td>
                            <button className="btn btn-sm btn-primary" onClick={() => this.props.onViewBtnClicked(puppy.puppyId)}><i className="fa fa-search"></i> View</button>
                            <button className="btn btn-sm btn-success ml-2" onClick={() => this.props.onUpdateBtnClicked(puppy.puppyId)}><i className="fa fa-edit"></i> Update</button>
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

    getPagination = () => {
        return (
            <Pagination
                onPageChange={this.updateDisplayedData.bind(this)}
                currentPage={this.state.paginationInfo.currentPage}
                totalItems={this.state.filteredData.length}
                maxPages={this.state.paginationInfo.maxPages}
                pageSize={this.state.paginationInfo.pageSize}
                />
        );
    }

    handleGirdSearch = (input) => {
        this.processGridSearch(input.target.value);
        this.setState({ gridSearch: input.target.value });
    }

    handlePageSizeChanged = (input) => {
        const paginationInfo = this.state.paginationInfo;
        paginationInfo.pageSize = input.target.value;
        this.setState({ paginationInfo: paginationInfo });
    }

    processGridSearch = (inputStr) => {
        let tempTableData;
        if (inputStr !== '') {
            const searchKeywords = inputStr.toLowerCase().trim().split(' ');
            const uniqueKeywords = [];
            searchKeywords.forEach(keyword => {
                if (uniqueKeywords.indexOf(keyword) === -1)
                    uniqueKeywords.push(keyword);
            });
            tempTableData = PuppiesTable.filterForKeywords(this.state.tableData, searchKeywords)
        } else {
            tempTableData = this.state.tableData;
        }
        const tempPaginationInfo = this.state.paginationInfo;
        tempPaginationInfo.totalItems = tempTableData.length;
        this.setState({ 
            filteredData: tempTableData,
            paginationInfo: tempPaginationInfo
        });
    }

    static filterForKeywords(tableData, searchKeywords) {
        let retVal;
        if (searchKeywords.length > 0) {
            retVal = tableData.filter(puppy => {
                let foundCount = 0;
                searchKeywords.forEach(searchKeyword => {
                    if (puppy.name.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (puppy.sex.toLowerCase() === searchKeyword)
                        foundCount++;
                    if (puppy.weight === parseFloat(searchKeyword))
                        foundCount++;
                    if (puppy.price === parseInt(searchKeyword))
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

export default PuppiesTable;