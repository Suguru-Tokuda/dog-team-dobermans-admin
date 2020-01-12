import React, { Component } from 'react';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';
import moment from 'moment';

class ParentsTable extends Component {
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
            orderAsc: false
        },
        gridSearch: '',
        pageSizes: [10, 25, 50],
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.parents;
        this.state.filteredData = JSON.parse(JSON.stringify(props.parents));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        if (JSON.stringify(props.parents) !== JSON.stringify(tableData) || props.totalItems !== paginationInfo.totalItems) {
            let filteredData;
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(props.parents, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(props.parents));
            }
            const newFilteredData = filteredData;
            if (props.totalItems !== paginationInfo.totalItems)
                paginationInfo.totalItems = props.totalItems;
            this.setState({
                tableData: props.parents,
                filteredData: newFilteredData,
                paginationInfo: paginationInfo,
                updateDisplayedData: true
            });
        }
        if (updateDisplayedData === true) {
            this.setState({ updateDisplayedData: false });
            this.updateDisplayedData(paginationInfo.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.parents !== prevState.tableData || nextProps.totalItems !== prevState.paginationInfo.totalItems) {
            const state = prevState;
            let filteredData;
            if (prevState.gridSearch !== '') {
                state.updateDataFormGridSearch = true;
                const searchKeywords = prevState.gridSearch.toLowerCase().trim().split(' ');
                filteredData = ParentsTable.filterForKeywords(nextProps.parents, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(nextProps.parents));
            }
            state.tableData = nextProps.parents;
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

    getSortIcon(accessor) {
        let sortIcon = '';
        if (accessor === this.state.sortData.key) {
            sortIcon = this.state.sortData.orderAsc === true ? <span className="fa fa-sort-asc" /> : <span className="fa fa-sort-desc" />;
        }
        return sortIcon;
    }

    getTable() {
        const thead = (
            <thead>
                <tr>
                    <th className="pointer" onClick={() => this.sortTable('name')}>Name {this.getSortIcon('name')}</th>
                    <th className="pointer" onClick={() => this.sortTable('gender')}>Gender {this.getSortIcon('gender')}</th>
                    <th className="pointer" onClick={() => this.sortTable('type')}>Type {this.getSortIcon('type')}</th>
                    <th className="pointer" onClick={() => this.sortTable('weight')}>Weight {this.getSortIcon('weight')}</th>
                    <th className="pointer" onClick={() => this.sortTable('color')}>Color {this.getSortIcon('color')}</th>
                    <th className="pointer" onClick={() => this.sortTable('dateOfBirth')}>Date of Birth {this.getSortIcon('dateOfBirth')}</th>
                    <th className="pointer" onClick={() => this.sortTable('live')}>Live {this.getSortIcon('live')}</th>
                    <th>Picture</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for parents" defaultValue={this.state.gridSearch} onKeyUp={this.handleGridSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (this.state.displayedData.length > 0) {
            const rows = this.state.displayedData.map((parent, i) => {
                const pictures = parent.pictures;
                let picture;
                if (typeof pictures !== 'undefined' && pictures.length > 0) {
                    picture = <img src={pictures[0].url} alt={pictures[0].url} className="rounded" style={{width: "50px"}} />;
                }
                return (
                  <tr key={`parent-${parent.parentID}`}>
                      <td>{parent.name}</td>
                      <td>{parent.gender}</td>
                      <td>{parent.type}</td>
                      <td>{parent.weight}</td>
                      <td>{parent.color}</td>
                      <td>{moment(parent.dateOfBirth).format('MM/DD/YYYY')}</td>
                      <td>{parent.live === true ? 'True' : 'False'}</td>
                      <td>{picture}</td>
                      <td>
                        <button type="button" className="btn btn-sm btn-primary" onClick={() => this.props.onViewBtnClicked(parent.parentID)}><i className="fa fa-search"></i> View</button>
                        <button type="button" className="btn btn-sm btn-success ml-1" onClick={() => this.props.onUpdateBtnClicked(parent.parentID)}><i className="fa fa-edit"></i> Update</button>
                        <button type="button" className="btn btn-sm btn-info ml-1" onClick={() => this.props.onLiveBtnClicked(parent.parentID)}><i className={`${parent.live === true ? 'fa fa-eye-slash' : 'fa fa-eye'}`}></i> {`${parent.live === true ? 'Hide' : 'Go Live'}`}</button>
                        <button type="button" className="btn btn-sm btn-danger ml-1" onClick={() => this.props.onDeleteBtnClicked(parent.parentID)}><i className="fa fa-close"></i> Delete</button>
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
        this.setState({ paginationInfo })
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
            tempTableData = ParentsTable.filterForKeywords(this.state.tableData, searchKeywords);
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
            retVal = tableData.filter(parent => {
                let foundCount = 0;
                searchKeywords.forEach(searchKeyword => {
                    if (parent.name.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (parent.gender.toLowerCase() === searchKeyword)
                        foundCount++;
                    if (parent.weight === parseFloat(searchKeyword))
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

export default ParentsTable;