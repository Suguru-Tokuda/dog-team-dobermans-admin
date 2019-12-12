import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AboutUsHome from './aboutUsHome';
import MissionStatementsEditor from './missionStatementsEditor';
import OurTeamEditor from './ourTeamEditor';

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
                <Route path={`${url}/mission-statements-editor`} exact render={(props) => <MissionStatementsEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/our-teams-editor`} exact render={(props) => <OurTeamEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default AboutUs;