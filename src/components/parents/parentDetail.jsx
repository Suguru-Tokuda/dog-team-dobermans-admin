import React, { Component } from 'react';

class ParentDetail extends Component {
    state = {
        parentId: ''
    };

    constructor(props) {
        super(props);
        this.state.parentId = props.parentId;
    }

    componentDidMount() {
        // API call to load parent data
    }

    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        );
    }
}

export default ParentDetail;