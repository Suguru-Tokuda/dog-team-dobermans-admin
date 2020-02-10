import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import TestimonialsList from './testimonialsList';
import TestimonialEditor from './testimonialEditor';

class Testimonials extends Component {
    render() { 
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path="/testimonials/editor/:testimonialID" render={(props) => <TestimonialEditor {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/testimonials/editor" exact render={(props) => <TestimonialEditor {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/testimonials" exact render={(props) => <TestimonialsList {...props} authenticated={authenticated} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default Testimonials;