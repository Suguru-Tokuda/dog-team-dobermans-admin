import React, { Component } from 'react';

class PuppyDetails extends Component {
    state = {
        puppyId: ''
    };

    constructor(props) {
        super(props);
        this.state.puppyId = props.puppyId;
    }

    componentDidMount() {
        // API call to load puppy data
    }

    

}