import React, { Component } from 'react';
import TestimonialsTable from './testimonialsTable';
import TestimonialService from '../../services/testimonialService';
import toastr from 'toastr';

class TestimonialsList extends Component {
    state = {
        testimonials: [],
        loaded: false
    };

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        TestimonialService.getAllTestimonials()
            .then(res => {
                res.data.sort((a, b) => { return a.created > b.created ? -1 : a.created < b.created ? 1 : 0; })
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
                     onUpdateBtnClicked={this.handleUpdateBtnClicked.bind(this)}
                     onDeleteConfBtnClicked={this.handleDeleteBtnClicked.bind(this)}
                     />
                );
            } else if (testimonials.length === 0) {
                return <h4>No testimonials available</h4>;
            }
        }
        return null;
    }

    handleUpdateBtnClicked = async (testimonials) => {
        this.props.onShowLoading(true, 1);
        try {
            testimonials.forEach(async (testimonial) => {
                const testimonialID = testimonial.testimonialID;
                delete testimonial.testominialID;
                try {
                    await TestimonialService.updateTestimonial(testimonialID, testimonial);
                } catch (err) {
                    console.log(err);
                }
            });
            await TestimonialService.getAllTestimonials()
                .then(res => {
                    this.setState({ testimonials: JSON.parse(JSON.stringify(res.data)) });
                })
                .catch(() => {
                    toastr.error('There was an error in loading testimonials data');
                });
            const message = testimonials.length > 1 ? `Successfuly updated ${testimonials.length} testimonials.` : 'Successfully updated 1 testimonial.';
            toastr.success(message);
        } catch (err) {
            toastr.error('There was an error in updating testimonial(s)'); 
            console.log(err);
        } finally {
            this.props.onDoneLoading();
        }
    }

    handleDeleteBtnClicked = (testimonialIDs) => {
        this.props.onShowLoading(true, 1);
        TestimonialService.deleteTestimonials(testimonialIDs)
            .then(async () => {
                setTimeout(async () => {
                    await TestimonialService.getAllTestimonials()
                        .then(res => {
                            this.setState({ testimonials: res.data });
                        })
                        .catch(() => {
                            toastr.error('There was an error in loading testimonials data');
                        });
                        const message = testimonialIDs.length > 1 ? `Successfully deleted ${testimonialIDs.length} testimonials.` : 'Successfully deleted 1 testimonial.';
                        toastr.success(message);
                }, 50);
            })
            .catch((err) => {
                toastr.error('There was an error in deleting testimonials');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
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

export default TestimonialsList;