import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import TestimonialsList from './testimonialsList';
import TestimonialEditor from './testimonialEditor';

class Testimonials extends Component {
    constructor(props) {
        super(props);
    }
    render() { 
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path="/testimonials/editor/:testimonialID" render={(props) => <TestimonialEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/testimonials/editor" render={(props) => <TestimonialEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/testimonials" exact render={(props) => <TestimonialsList {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default Testimonials;