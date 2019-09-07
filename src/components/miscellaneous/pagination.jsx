import React, { Component } from 'react';
import PaginationService from '../../services/paginationService';

class Pagination extends Component {
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
        const paginationInfo = PaginationService.getPaginationData(this.state.totelItems, props.currentPage, this.state.maxPages, this.state.pageSize);
        this.state.paginationInfo = paginationInfo;
        props.onPageChange(this.state.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pageSize !== prevState.pageSize || nextProps.totalItems !== prevState.totalItems) {
            const state = prevState;
            const paginationInfo = PaginationService.getPaginationData(nextProps.totalItems, 1, prevState.maxPages, nextProps.pageSize);
            state.paginationInfo = paginationInfo;
            if (nextProps.pageSize !== prevState.pageSize) {
                state.pageSize = nextProps.pageSize;
            }
            if (nextProps.totalItems !== prevState.totalItems) {
                state.totalItems = nextProps.totalItems;
            }
            nextProps.onPageChange(1, paginationInfo.startIndex, paginationInfo.endIndex);
            return state;
        } else if (prevState.currentPage !== nextProps.currentPage) {
            const totalItems = prevState.paginationInfo.totalItems;
            const paginationInfo = paginationService.getPaginationData(totalItems, nextProps.currentPage, prevState.maxPages, prevState.pageSize);
            const state = prevState;
            state.currentPage = nextProps.currentPage;
            state.paginationInfo = paginationInfo;
            nextProps.onPageChange(nextProps.currentPage, paginationInfo.startIndex, paginationInfo.endIndex);
        } else {
            return null;
        }
    }
}