import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import BlogList from './blogList';
import BlogEditor from './blogEditor';

class Blog extends Component {

    render() {
        const { authenticated } = this.props;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path="/blog/view/:blogID" render={(props) => <BlogEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/blog/create" render={(props) => <BlogEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/blog/update/:blogID" render={(props) => <BlogEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/blog/delete/:blogID" render={(props) => <BlogEditor {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path="/blog" exact render={(props) => <BlogList {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});

export default connect(mapStateToProps)(Blob);