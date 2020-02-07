import React, { Component } from 'react';
import $ from 'jquery';

export default class ImageDeleteConfModal extends Component {
    state = {
        index: -1,
        image: {}
    };

    componentDidMount() {
        $('#imageDeleteConfModal').on('hidden.bs.modal', () => {
            this.setState({ index: -1, image: {} });
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.image) !== JSON.stringify(prevState.image)) {
            return { image: nextProps.image, index: nextProps.index };
        }
        return null;
    }

    render() {
        const { image, index } = this.state;
        return (
            <div className="modal fade" id="imageDeleteConfModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Image Delete Confirmation</h3>
                            <p>Delete cannot be undone. Please make confirm.</p>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    {image.url && (
                                        <img src={image.url} alt={image.reference} className="img-fluid" width="100%" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={() => this.props.onDoDeleteBtnClicked(index)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}