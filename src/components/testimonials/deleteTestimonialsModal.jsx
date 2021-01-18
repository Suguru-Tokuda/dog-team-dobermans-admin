import React, { Component } from 'react';

class DeleteTestimonialsModa extends Component {
    state = {
        testimonials: []
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.testimonials) !== JSON.stringify(prevState.testimonials)) {
            return { testimonials: nextProps.testimonials };
        }
        return null;
    }

    getTableRows() {
        const { testimonials } = this.state;
        if (testimonials.length > 0) {
            return testimonials.map((testimonial, i) => {
                return (
                    <tr key={`testimonial-${i}`}>
                        <td>{testimonial.firstName}</td>
                        <td>{testimonial.lastName}</td>
                        <td>{testimonial.email}</td>
                        <td>{testimonial.approved === true ? 'True' : 'False'}</td>
                        <td>{testimonial.created}</td>
                        <td>
                            {testimonial.picture !== null && (
                                <img src={testimonial.picture.url} className="rounded" style={{width: "50px"}} alt={testimonial.picture.reference} />
                            )}
                        </td>
                    </tr>
                );
            });
        }
    }

    render() {
        return (
            <div className="modal fade" id="deleteTestimonialsModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Delete Confirmation</h3>
                            <p>Delete cannot be undone. Please confirm.</p>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Approved</th>
                                            <th>Created</th>
                                            <th>Picture</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.getTableRows()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={this.props.onDoDeleteBtnClicked}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteTestimonialsModa;