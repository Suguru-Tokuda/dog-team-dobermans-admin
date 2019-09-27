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

    getModal() {
        if (this.state.puppyId !== '') {

        }
    }

    render() {
        return <h2>Delete conf modal</h2>
    }
}

export default PuppyDeleteConfModal;