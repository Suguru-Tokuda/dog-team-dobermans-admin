import React, { Component } from 'react';
import { Checkbox } from 'react-ui-icheck';
import DeleteTestimonialsModal from './deleteTestimonialsModal';
import SortService from '../../services/sortService';
import Pagination from '../miscellaneous/pagination';
import $ from 'jquery';
import moment from 'moment';

class TestimonialsTable extends Component {
    state = {
        tableData: [],
        filteredData: [],
        displayedData: [],
        testimonialsToDelete: [],
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
        checkAll: false,
        girdSearch: '',
        pageSizes: [10, 25, 50],
        updateDisplayedData: false
    };

    constructor(props) {
        super(props);
        this.state.tableData = props.testimonials.map(testimonial => { testimonial.selected = false; return testimonial; });
        this.state.filteredData = JSON.parse(JSON.stringify(this.state.tableData));
        this.state.paginationInfo.totalItems = props.totalItems;
    }

    componentDidUpdate(props) {
        const { tableData, paginationInfo, gridSearch, updateDisplayedData } = this.state;
        const newTestimonials = JSON.parse(JSON.stringify(props.testimonials)).map(testimonial => { testimonial.selected = false; return testimonial; });
        const currentTableData = JSON.parse(JSON.stringify(tableData)).map(testimonial => { testimonial.selected = false; return testimonial; });
        if (JSON.stringify(newTestimonials) !== JSON.stringify(currentTableData)) {
            let filteredData;
            if (gridSearch !== '') {
                const searchKeywords = gridSearch.toLowerCase().trim().split(' ');
                filteredData = this.filterForKeywords(newTestimonials, searchKeywords);
            } else {
                filteredData = JSON.parse(JSON.stringify(newTestimonials));
            }
            paginationInfo.totalItems = props.totalItems;
            this.setState({
                tableData: newTestimonials,
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
        displayedData.forEach(testimonial => {
            if (testimonial.selected === true)
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
                    <th className="text-center"><Checkbox checkboxClass="icheckbox_square-blue" increaseArea="-100%" checked={checkAll} onChange={this.handleAllCheckChanged} label=" "></Checkbox></th>
                    <th>TestimonialID</th>
                    <th className="pointer" onClick={() => this.sortTable('firstName')}>First Name {this.getSortIcon('firstName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('lastName')}>Last Name {this.getSortIcon('lastName')}</th>
                    <th className="pointer" onClick={() => this.sortTable('email')}>Email {this.getSortIcon('email')}</th>
                    <th className="pointer" onClick={() => this.sortTable('live')}>Live {this.getSortIcon('live')}</th>
                    <th className="pointer" onClick={() => this.sortTable('created')}>Created {this.getSortIcon('created')}</th>
                    <th>Picture</th>
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
                    <td className="text-center">
                        <Checkbox 
                        checkboxClass="icheckbox_square-blue" 
                        increaseArea="-100%"
                        checked={testimonial.selected}
                        onChange={this.handleCheckChanged.bind(this, i)}
                        label=" "
                        />
                    </td>
                    <td>{testimonial.testimonialID}</td>
                    <td>{testimonial.firstName}</td>
                    <td>{testimonial.lastName}</td>
                    <td>{testimonial.email}</td>
                    <td>{testimonial.live === true ? 'Live' : 'Not Live'}</td>
                    <td>{moment(testimonial.created).format('MM/DD/YYYY')}</td>
                    <td><img src={testimonial.picture.url} className="rounded" style={{width: "50px"}} alt={testimonial.picture.reference} /></td>
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

    getNumberOfSelectedTestimonials() {
        const { displayedData } = this.state;
        let count = 0;
        displayedData.forEach(testimonial => {
            if (testimonial.selected === true)
                count++;
        });
        return count;
    }

    handleCheckChanged = (index, e, checked) => {
        const { displayedData, tableData, filteredData } = this.state;
        displayedData[index].selected = checked;
        const testimonialID = displayedData[index].testimonialID;
        for (let i = 0, max = tableData.length; i < max; i++) {
            if (tableData[i].testimonialID === testimonialID) {
                tableData[i].selected = checked;
            }
        }
        for (let i = 0, max = filteredData.length; i < max; i++) {
            if (filteredData[i].testimonialID === testimonialID) {
                filteredData[i].selected = checked;
                break;
            }
        }
        let counter = 0;
        displayedData.forEach(testimonial => {
            if (testimonial.selected === true)
                counter++;
        });
        const checkAll = counter === displayedData.length;
        this.setState({ displayedData: displayedData, tableData: tableData, filteredData: filteredData, checkAll: checkAll });
    }

    handleAllCheckChanged = (e, checked) => {
        const { tableData, filteredData, displayedData } = this.state;
        for (let i = 0, max = displayedData.length; i < max; i++) {
            displayedData[i].selected = checked;
        }
        const testimonialIDs = displayedData.map(testimonial => testimonial.testimonialID);
        for (let i = 0, max = tableData.length; i < max; i++) {
            if (testimonialIDs.indexOf(tableData[i].testimonialID) !== -1) {
                tableData[i].selected = checked;
            }
        }
        for (let i = 0, max = filteredData.length; i < max; i++) {
            if (testimonialIDs.indexOf(filteredData[i].testimonialID) !== -1) {
                filteredData[i].selected = checked;
            }
        }
        this.setState({ checkAll: checked, tableData: tableData, filteredData: filteredData, displayedData: displayedData });
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

    handleApproveSelectedTestimonials = async () => {
        const { tableData } = this.state;
        for (let i = 0, max = tableData.length; i < max; i++) {
            const testimonialToUpdate = JSON.parse(JSON.stringify(tableData[i]));

        }
    }

    handleDeleteSelectedTestimonials = () => {
        const { tableData } = this.state;
        const testimonialsToDelete = [];
        for (let i = 0, max = tableData.length; i < max; i++) {
            if (tableData[i].selected === true) {
                const testimonialToDelete = JSON.parse(JSON.stringify(tableData[i]));
                delete testimonialToDelete.selected;
                testimonialsToDelete.push(testimonialToDelete);
            }
        }
        this.setState({ testimonialsToDelete });
        if ($('#deleteTestimonialsModal').is(':visible') === false) {
            $('#deleteTestimonialsModal').modal('show');
        }
    }

    handleCancelBtnClicked = () => {
        this.setState({ testimonialsToDelete: [] });
        if ($('#deleteTestimonialsModal').is(':visible') === true) {
            $('#deleteTestimonialsModal').modal('hide');
        }
    }

    handleDoDeleteBtnClicked = () => {

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
            tempTableData = this.filterForKeywords(this.state.tableData, searchKeywords);
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
        const { testimonialsToDelete } = this.state;
        const buttonDisabled = this.getNumberOfSelectedTestimonials() === 0;
        return (
            <React.Fragment>
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.handleApproveSelectedTestimonials}>Approve</button>
                                    <button className="btn btn-danger ml-2" disabled={buttonDisabled} onClick={this.handleDeleteSelectedTestimonials}>Delete</button>
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
                <DeleteTestimonialsModal testimonials={testimonialsToDelete} onCancelBtnClicked={this.handleCancelBtnClicked} onDoDeleteBtnClicked={this.handleDoDeleteBtnClicked} />
            </React.Fragment>
        );
    }
}

export default TestimonialsTable;