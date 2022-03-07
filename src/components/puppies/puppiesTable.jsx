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
        sortData: {
            key: 'dateOfBirth',
            orderAsc: false
        },
        gridSearch: '',
        pageSizes: [10, 25, 50],
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.puppies;
        this.state.filteredData = JSON.parse(JSON.stringify(props.puppies));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        if (JSON.stringify(props.puppies) !== JSON.stringify(tableData)) {
            let filteredData;
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(props.puppies, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(props.puppies));
            }
            if (props.totalItems !== paginationInfo.totalItems)
                paginationInfo.totalItems = props.totalItems;
            this.setState({ 
                tableData: props.puppies,
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
        } else if (this.state.sortData.key === '') {
            sortIcon = <span className="fa fa-sort" />;
        }
        return sortIcon;
    }

    getTable() {
        const thead = (
            <thead>
                <tr>
                    <th className="pointer" onClick={() => this.sortTable('puppyID')}>PuppyID {this.getSortIcon('puppyID')}</th>
                    <th className="pointer" onClick={() => this.sortTable('name')}>Name {this.getSortIcon('name')}</th>
                    <th className="pointer" onClick={() => this.sortTable('dateOfBirth')}>DOB {this.getSortIcon('dateOfBirth')}</th>
                    <th className="pointer" onClick={() => this.sortTable('gender')}>Sex {this.getSortIcon('gender')}</th>
                    <th className="pointer" onClick={() => this.sortTable('weight')}>Weight {this.getSortIcon('weight')}</th>
                    <th className="pointer" onClick={() => this.sortTable('price')}>Price {this.getSortIcon('price')}</th>
                    <th>Picture</th>
                    <th className="pointer" onClick={() => this.sortTable('color')}>Color {this.getSortIcon('color')}</th>
                    <th className="pointer" onClick={() => this.sortTable('type')}>Type {this.getSortIcon('type')}</th>
                    <th className="pointer" onClick={() => this.sortTable('sold')}>Status {this.getSortIcon('sold')}</th>
                    <th>Buyer</th>
                    <th className="pointer" onClick={() => this.sortTable('live')}>Live {this.getSortIcon('live')}</th>
                    <th>Action</th>
                </tr>
                <tr>
                    <th colSpan="100%">
                        <input type="text" className="form-control" placeholder="Search for PuppyID, name, color, type, sex, price, and sold & live status" value ={this.state.gridSearch} onChange={this.handleGirdSearch} />
                    </th>
                </tr>
            </thead>
        );
        let tbody;
        if (this.state.displayedData.length > 0) {
            const rows = this.state.displayedData.map((puppy, i) => {
                let picture;
                const pictures = puppy.pictures;
                if (typeof pictures !== 'undefined' && pictures.length > 0) {
                    picture = <img src={pictures[0].url} alt={pictures[0].reference} className="rounded" style={{ width: "50px"}} />;
                } else {
                    picture = <div className="rounded">Not available</div>
                }
                return (
                    <tr key={`puppy-${puppy.puppyID}`}>
                        <td>{puppy.puppyID}</td>
                        <td>{puppy.name}</td>
                        <td>{moment(puppy.dateOfBirth).format('MM/DD/YYYY')}</td>
                        <td>{`${puppy.gender.substring(0, 1).toUpperCase()}${puppy.gender.substring(1, puppy.gender.length)}`}</td>
                        <td>{puppy.weight}</td>
                        <td>{`$${puppy.price}`}</td>
                        <td>{picture}</td>
                        <td>{puppy.color}</td>
                        <td>{`${puppy.type.substring(0, 1).toUpperCase()}${puppy.type.substring(1, puppy.type.length)}`}</td>
                        <td>{puppy.paidAmount === 0 ? 'Available' : puppy.paidAmount !== puppy.price ? 'Pending' : 'Adopted'}</td>
                        <td>{puppy.buyer && (
                            `${puppy.buyer.firstName} ${puppy.buyer.lastName}`
                        )}</td>
                        <td>{puppy.live === true ? 'Live' : 'No'}</td>
                        <td style={{ whiteSpace: 'nowrap'}}>
                            <button type="button" className="btn btn-sm btn-primary" onClick={() => this.props.onViewBtnClicked(puppy.puppyID)}><i className="fa fa-search"></i> View</button>
                            <button type="button" className="btn btn-sm btn-success ml-1" onClick={() => this.props.onUpdateBtnClicked(puppy.puppyID)}><i className="fa fa-edit"></i> Update</button>
                            <button type="button" className="btn btn-sm btn-info ml-1" onClick={() => this.props.onTransactionBtnClicked(puppy.puppyID)}><i className="fa fa-dollar"></i> Transaction</button>
                            {puppy.paidAmount > 0 && (
                                <button type="button" className="btn btn-sm btn-danger ml-1" onClick={() => this.props.onCancelTransactionBtnClicked(puppy.puppyID)}><i className="fa fa-dollar"></i>Cancel Transaction</button>
                            )}
                            <button type="button" className={`btn btn-sm ml-1 ${puppy.showPrice ? 'btn-primary' : 'btn-info'}`} onClick={() => this.props.onLiveBtnClicked(puppy.puppyID)}><i className={`${puppy.live === true ? 'fa fa-eye-slash' : 'fa fa-eye'}`}></i> {`${puppy.live === true ? 'Hide' : 'Go Live'}`}</button>
                            <button type="button" 
                                    className="btn btn-sm btn-info ml-1"
                                    onClick={() => this.props.onShowPriceBtnClicked(puppy.puppyID)}
                            >
                                {puppy.showPrice ? 'Show' : 'Hide'} <i className="fa fa-dollar"></i>
                            </button>
                            {puppy.paidAmount === 0 && (
                                <button type="button" className="btn btn-sm btn-danger ml-1" onClick={() => this.props.onDeleteBtnClicked(puppy.puppyID)}><i className="fa fa-close"></i> Delete</button>
                            )}
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

    filterForKeywords(tableData, searchKeywords) {
        let retVal;
        if (searchKeywords.length > 0) {
            retVal = tableData.filter(puppy => {
                let foundCount = 0;
                let foundForID = false;
                for (let i = 0, max = searchKeywords.length; i < max; i++) {
                    const searchKeyword = searchKeywords[i];
                    if (puppy.puppyID.toLowerCase() === searchKeyword) {
                        foundForID = true;
                        break;
                    }
                    if (puppy.name.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (puppy.gender.toLowerCase() === searchKeyword)
                        foundCount++;
                    if (puppy.price === parseInt(searchKeyword))
                        foundCount++;
                    if (puppy.type.toLowerCase().indexOf(searchKeyword) !== -1)
                        foundCount++;
                    if (puppy.paidAmount === 0 && searchKeyword === 'unsold')
                        foundCount++;
                    if (puppy.paidAmount > 0 && searchKeyword === 'sold')
                        foundCount++;
                    if (puppy.live === true && searchKeyword === 'live')
                        foundCount++;
                    if (puppy.live === false && searchKeyword === 'unlive')
                        foundCount++;
                }
                if (foundForID === true) {
                    return true;
                } else {
                    return foundCount === searchKeywords.length;
                }
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