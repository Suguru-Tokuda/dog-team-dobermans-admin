import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Banner extends Component {
    state = {
        title: '',
        description: '',
        picture: ''
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const props = {
            title: nextProps.banner.title,
            description: nextProps.banner.description,
            picture: nextProps.banner.picture
        };
        if (JSON.stringify(props) !== JSON.stringify(prevState)) {
            return props;
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state.title = props.banner.title;
        this.state.description = props.banner.description;
        this.state.picture = props.banner.picture;
    }

    render() {
        const { title, description, picture } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    Banner
                </div>
                <div className="card-body">
                    {typeof picture !== 'undefined' && (
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th>Title</th>
                                        <td>{title}</td>
                                    </tr>
                                    <tr>
                                        <th>Description</th>
                                        <td>{description}</td>
                                    </tr>
                                    <tr>
                                        <th>Picture</th>
                                        <td>
                                            <img src={picture.url} alt={picture.reference} className="img-fluid" style={{width: "100%"}} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <Link className="btn btn-primary" to="/banner">Edit</Link>
                </div>
            </div>
        );
    }
}

export default Banner;