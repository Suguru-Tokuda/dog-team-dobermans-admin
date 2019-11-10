import React, { Component } from 'react';
import TestimonialService from '../../services/testimonialService';

class Testimonials extends Component {
    state = {
        testimonials: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { testimonials } = this.state;
        return null;
    }
}