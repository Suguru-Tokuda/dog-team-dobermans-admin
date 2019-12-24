import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import BlogList from './blogList';
import BlogDetail from './blogDetail';

class Blog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/blog/:blogID" render={(props) => <BlogDetail {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path="/blog" exact render={(props) => <BlogList {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        )
    }
}

export default Blog;