import React, { Component } from 'react';
import paginationService from '../../services/paginationService';

class PaginationButtons extends Component {
    state = {
        totalItems: 0,
        currentPage: this.props.currentPage,
        maxPages: this.props.maxPages,
        pageSize: this.props.pageSize,
        paginationInfo: {
            totalItems: 0,
            currentPage: 0,
            pageSize: 0,
            totalPages: 0,
            endPage: 0,
            startIndex: 0,
            endIndex: 0,
            pages: 0
        }
    };

    constructor(props) {
        super(props);

        // calculate total pages
        this.state.totalPages = Math.ceil(this.state.totalItems / this.state.pageSize);
        this.state.totalItems = props.totalItems;

        const { totalItems, maxPages, pageSize } = this.state;
        const { currentPage } = props;

        this.state.paginationInfo = paginationService.getPaginationData(totalItems, currentPage, maxPages, pageSize);

        const { startIndex, endIndex } = this.state.paginationInfo;

        props.onPageChange(currentPage, startIndex, endIndex);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pageSize !== prevState.pageSize || nextProps.totalItems !== prevState.totalItems) {
            const state = prevState;
            const { totalItems, pageSize } = nextProps;
            const { maxPages } = prevState;
            const paginationInfo = paginationService.getPaginationData(totalItems, 1, maxPages, pageSize);

            state.paginationInfo = paginationInfo;

            if (pageSize !== prevState.pageSize) {
                state.pageSize = nextProps.pageSize;
            }

            if (totalItems !== prevState.totalItems) {
                state.totalItems = nextProps.totalItems;
            }

            const { startIndex, endIndex } = paginationInfo;

            nextProps.onPageChange(1, startIndex, endIndex);
            
            return state;
        } else if (prevState.currentPage !== nextProps.currentPage) {
            const state = prevState;

            const { totalItems } = prevState.paginationInfo;
            const { currentPage } = nextProps;
            const { maxPages, pageSize } = prevState;

            const paginationInfo = paginationService.getPaginationData(totalItems, currentPage, maxPages, pageSize);

            state.currentPage = currentPage;
            state.paginationInfo = paginationInfo;

            const { startIndex, endIndex } = paginationInfo;

            nextProps.onPageChange(currentPage, startIndex, endIndex);
        } else {
            return null;
        }
    }

    handlePageChange = (clickedPage) => {
        if (clickedPage > 0 && clickedPage <= this.state.paginationInfo.totalPages) {
            if (clickedPage !== this.state.paginationInfo.currentPage) {
                const paginationInfo = paginationService.getPaginationData(this.state.totalItems, clickedPage, this.state.maxPages, this.state.pageSize);

                this.setState({
                    currentPage: clickedPage,
                    paginationInfo: paginationInfo
                });

                this.props.onPageChange(clickedPage, paginationInfo.startIndex, paginationInfo.endIndex);
            }
        }
    }

    getPrevBtnClass = () => {
        return this.state.currentPage === 1 ? 'disabled' : '';
    }

    getNextBtnClass = () => {
        return this.state.currentPage === this.state.paginationInfo.totalPages ? 'disabled' : '';
    }

    render() {
        const { currentPage } = this.state;

        return (
            <React.Fragment>
                <button className={`btn btn-light ${this.getPrevBtnClass()}`}
                        type="button"
                        onClick={() => this.handlePageChange(currentPage - 1)}
                >
                    <i className="fas fa-angle-left"></i>
                </button>
                <button className={`btn btn-light ${this.getNextBtnClass()}`}
                        type="button"
                        onClick={() => this.handlePageChange(currentPage + 1)}
                >
                    <i className="fas fa-angle-right"></i>
                </button>
            </React.Fragment>
        );

    }
}

export default PaginationButtons;