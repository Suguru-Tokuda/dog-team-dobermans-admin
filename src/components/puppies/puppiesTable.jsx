import React, { Component } from 'react';

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
            pageSize: 10
        },
        columns: [
            { header: 'Name', accessor: 'name'},
            { header: 'Sex', accessor: 'sex' },
            { header: 'Weight', accessor: 'weight' },
            { header: 'Price', accessor: 'price' },
            { header: 'Picture', accessor: 'picture' }
        ],
        sortData: {
            key: 'name',
            orderAsc: false
        },
        pageSizes: [10, 25, 50],
    };

    constructor(props) {
        super(props);
        
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


}

export default PuppiesTable;