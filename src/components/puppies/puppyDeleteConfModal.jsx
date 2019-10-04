import React, { Component } from 'react';

class PuppyDeleteConfModal extends Component {
    state = {
        puppyId: '',
        puppyData: {}
    };

    constructor(props) {
        this.state.puppyId = props.puppyId;
        this.state.puppyData = props.puppyData;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.puppyId !== prevState.puppyId) {
            return { puppyId: nextProps.puppyId, puppyData: {} };
        }
        return null;
    }

    componentDidUpdate() {
        if (this.state.showModal === true) {
            $('#puppyDeleteConfModal').modal('show');
        } else {
            $('#puppyDeleteConfModal').modal('hide');
        }
    }

    getModal() {
        if (this.state.puppyId !== '') {

        }
    }

    render() {
        const { puppyId, puppyData } = this.state;
        return <h2>Delete conf modal</h2>
    }
}

export default PuppyDeleteConfModal;