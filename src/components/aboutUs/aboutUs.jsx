import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AboutUsHome from './aboutUsHome';
import IntroductionsEditor from './introductionsEditor';
import OurTeamsEditor from './ourTeamsEditor';

class AboutUs extends Component {
    state = {
        url: {}
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    render() {
        const { url } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}`} exact render={(props) => <AboutUsHome {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/introductions-editor`} exact render={(props) => <IntroductionsEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/our-teams-editor`} exact render={(props) => <OurTeamsEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default AboutUs;