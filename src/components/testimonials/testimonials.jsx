import React, { Component } from 'react';
import TestimonialsTable from './testimonialsTable';
import TestimonialService from '../../services/testimonialService';
import toastr from 'toastr';

class Testimonials extends Component {
    state = {
        testimonials: [],
        loaded: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        TestimonialService.getAllTestimonials()
            .then(res => {
                this.setState({ testimonials: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading testimonials data');
            })
            .finally(() => {
                this.props.onDoneLoading();
                this.setState({ loaded: true });
            });
    }

    getTable() {
        const { testimonials, loaded } = this.state;
        if (loaded === true) {
            if (testimonials.length > 0) {
                return (
                    <TestimonialsTable 
                     testimonials={testimonials}
                     totalItems={testimonials.length}
                     />
                );
            } else if (testimonials.length === 0) {
                return (
                    <div className="card">
                        <div className="card-header">
                            <h2>Testimonials</h2>
                        </div>
                        <div className="card-body">
                            <h4>No testimonials available</h4>
                        </div>
                    </div>
                );
            }
        }
        return null;
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3>Testimonials</h3>
                        </div>
                        <div className="card-body">
                            {this.getTable()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Testimonials;