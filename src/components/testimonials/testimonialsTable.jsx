import React, { Component } from 'react';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';
import moment from 'moment';

class TestimonialsTable extends Component {
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
        girdSearch: '',
        pageSizes: [10, 25, 50],
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.testimonials;
        this.state.filteredData = JSON.parse(JSON.stringify(props.testimonials));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        if (JSON.stringify(props.testimonials) !== JSON.stringify(tableData)) {
            let filteredData;
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(props.testimonials, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(props.testimonials));
            }
            paginationInfo.totalItems = props.totalItems;
            this.setState({
                tableData: props.testimonials,
                filteredData: filteredData,
                paginationInfo: paginationInfo,
                updateDisplayedData: true
            });
        }
        if (updateDisplayedData === true) {
            this.setState({ updateDisplayedData: false});
            this.updateDisplayedData(paginationInfo.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        }
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
        const { displayedData, gridSearch } = this.state;
        const thead = (
            <thead>
                <tr>
                    <th className="pointer" onClick={() => this.sortTable('firstName')}>First Name {this.getSortIcon('firstName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('lastName')}>Last Name {this.getSortIcon('lastName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('email')}>Email {this.getSortIcon('email')}</th>
                    <th className="pointer" onClick={() => this.sortTable('phone')}>Phone {this.getSortIcon('phone')}</th>
                    <th className="pointer" onClick={() => this.sortTable('live')}>Live {this.getSortIcon('live')}</th>
                    <th className="pointer" onClick={() => this.sortTable('datePosted')}> {this.getSortIcon('datePosted')}</th>
                    <th>Picture</th>
                    <th>Action</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for testimonials" defaultValue={gridSearch} onKeyUp={this.handleGridSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (displayedData.length > 0) {
            const rows = displayedData.map((testimonial, i) => 
                <tr key={`testimonial-${i}`}>
                    <td>{testimonial.firstName}</td>
                    <td>{testimonial.lastName}</td>
                    <td>{testimonial.email}</td>
                    <td>{testimonial.phone}</td>
                    <td>{testimonial.live === true ? 'Live' : 'Not Live'}</td>
                    <td>{moment(testimonial.datePosted).format('MM/DD/YYYY')}</td>
                    <td><img src={testimonial} className="rounded" style={{width: "50px"}} alt={testimonial.picture.reference}  /></td>
                    <td>
                        <button className="btn btn-sm btn-success">{testimonial.live === true ? 'Hide' : 'Go Live'}</button>
                        <button className="btn btn-sm btt-danger">Delete</button>
                    </td>
                </tr>
            );
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

    handleGirdSearch = (input) => {
        this.processGridSearch(input.target.value);
        this.setState({ gridSearch: input.target.value });
    }

    handlePageSizeChanged = (input) => {
        const paginationInfo = this.state.paginationInfo;
        paginationInfo.pageSize = parseInt(input.target.value);
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
            tempTableData = this.filterForKeywords(this.state.tableData, searchKeywords)
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

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <div className="float-right">
                                    {this.getPageSizaeOptions()}
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

export default TestimonialsTable;