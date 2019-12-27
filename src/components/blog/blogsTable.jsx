import React, { Component } from 'react';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';
import moment from 'moment';

class BlogsTable extends Component {
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
        udateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.blogs;
        this.state.filteredData = JSON.parse(JSON.stringify(props.blogs));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        if (JSON.stringify(props.blogs) !== JSON.stringify(tableData)) {
            let filteredData;
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(props.blogs, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(props.blogs));
            }
            if (props.totalItems !== paginationInfo.totalItems)
                paginationInfo.totalItems = props.totalItems;
            this.setState({
                tableData: props.blogs,
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
        if (startIndex !== endIndex) {
            displayedData = this.state.filteredData.slice(startIndex, endIndex + 1);
        } else {
            displayedData = this.state.filteredData.slice(startIndex, startIndex + 1);
        }
        const { paginationInfo } = this.state;
        paginationInfo.currentPage = currentPage;
        paginationInfo.startIndex = startIndex;
        paginationInfo.endIndex = endIndex;
        this.setState({
            paginationInfo: paginationInfo,
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
        const { displayedData } = this.state;
        const thead = (
            <thead>
                <tr>
                    <th className="pointer" onClick={() => this.sortTable('blogID')}>BlogID {this.getSortIcon('blogID')}</th>
                    <th className="pointer" onClick={() => this.sortTable('author')}>Author {this.getSortIcon('author')}</th>
                    <th className="pointer" onClick={() => this.sortTable('subject')}>Subject {this.getSortIcon('subject')}</th>
                    <th className="pointer" onClick={() => this.sortTable('message')}>Message {this.getSortIcon('message')}</th>
                    <th>Thumbnail</th>
                    <th className="pointer" onClick={() => this.sortTable('created')}>Created {this.getSortIcon('created')}</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for puppies" value={this.state.gridSearch} onChange={this.handleGirdSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (displayedData.length > 0) {
            const rows = displayedData.map((blog, i) => {
                return (
                    <tr key={`blog-${blog.blogID}`}>
                        <td>{blog.blogID}</td>
                        <td>{blog.author}</td>
                        <td>{blog.subject}</td>
                        <td>{blog.message}</td>
                        <td>
                            <img src={blog.thumbnail.url} alt={blog.thumbnail.reference} style={{width: '50px' }} />
                        </td>
                        <td>{moment(blog.created).format('MM/DD/YYYY hh:mm:ss')}</td>
                        <td>
                            <button className="btn btn-sm btn-primary" onClick={() => this.props.onViewBtnClicked(blog.blogID)}>View</button>
                            <button className="btn btn-sm btn-success ml-2" onClick={() => this.props.onUpdateBtnClicked(blog.blogID)}>Update</button>
                            <button className="btn btn-sm btn-danger ml-2" onClick={() => this.props.onDeleteBtnClicked(blog.blogID)}>Delete</button>
                        </td>
                    </tr>
                )
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
        let filteredData;
        if (inputStr !== '') {
            const searchKeywords = inputStr.toLowerCase().trim().split(' ');
            const uniqueKeywords = [];
            searchKeywords.forEach(keyword => {
                if (uniqueKeywords.indexOf(keyword) === -1)
                    uniqueKeywords.push(keyword);
            });
            filteredData = this.filterForKeywords(this.state.tableData, searchKeywords)
        } else {
            filteredData = this.state.tableData;
        }
        const { paginationInfo }  = this.state;
        paginationInfo.totalItems = filteredData.length;
        this.setState({ filteredData, paginationInfo });
    }

    filterForKeywords(tableData, searchKeywords) {
        let retVal;
        if (searchKeywords.length > 0) {
            retVal = tableData.filter(blog => {
                let foundCount = 0;
                searchKeywords.forEach(searchKeyword => {
                    if (blog.subject.toLowerCase() === searchKeyword)
                        foundCount++;
                    if (blog.subject.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (blog.author.toLowerCase() === searchKeyword)
                        foundCount++;
                    if (blog.message.toLowerCase() === searchKeyword)
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

export default BlogsTable;