import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';

class AboutUs extends Component {
    state = {
        aboutUsDetail: {}
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then((res) => {
                this.setState({ aboutUsDetail: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading about us data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        return (
            <h1>AboutUs</h1>
        );
    }
}

export default AboutUs;