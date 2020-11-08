import React, { Component } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});

export default connect(mapStateToProps)(Main);