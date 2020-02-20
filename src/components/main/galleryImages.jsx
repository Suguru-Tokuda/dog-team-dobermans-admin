import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';

export default class GalleryImages extends Component {
    state = {
        images: []
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.images) !== JSON.stringify(prevState.images)) {
            return { images: nextProps.images };
        }
        return null;
    }

    renderImages() {
        const { images } = this.state;
        if (images.length > 0) {
            const imageObjects = images.map(image => {
                return {
                    original: image.url,
                    thumbnail: image.url,
                    originalAlt: image.reference,
                    thumbnailAlt: image.reference
                }
            });
            return <ImageGallery items={imageObjects} />
        } else {
            return null;
        }
    }

    render ()  {
        const { images } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    Gallery Images
                </div>
                <div className="card-body">
                    <div className="text-center">
                        {images.length > 0 && (
                            this.renderImages()
                        )}
                    </div>
                </div>
                <div className="card-footer">
                    <Link to="/gallery-image-editor" className="btn btn-primary">Update</Link>
                </div>
            </div>
        )
    }
}