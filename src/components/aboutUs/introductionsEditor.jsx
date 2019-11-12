import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';

class IntroductionsEditor extends Component {
    state = {
        introductions: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then(res => {
                if (typeof res.data.introductions !== 'undefined') {
                    this.setState({ introductions: res.data.introductions });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        return <h2>Introductions editor</h2>;
    }
}

export default IntroductionsEditor;