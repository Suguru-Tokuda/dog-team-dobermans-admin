import React, { Component } from 'react';
import $ from 'jquery';

class WaitListEmailModal extends Component {
    state = {
        subject: '',
        emailBody: '',
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { subject, emailBody } = this.state;
    }
};