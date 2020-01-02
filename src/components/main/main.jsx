import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import HomepageContent from './homepageContent';

class Main extends Component {
    render() {
        const { authenticated } = this.props;
            if (authenticated === true) {
                return (
                    <React.Fragment>
                        <Route path="/" exact render={(props) => <HomepageContent {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    </React.Fragment>
                );
            } else {
                return <Redirect to="/login" />;
            }
    }
}

export default Main;