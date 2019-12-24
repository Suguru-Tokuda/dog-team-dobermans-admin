import React, { Component } from 'react';
import BlogsTable from './blogsTable';
import BlogEditorModal from './blogEditorModal';
import BlogService from '../../services/blogService';
import $ from 'jquery';
import toastr from 'toastr';

class BlogList extends Component {
    state = {
        selectedBlog: null,
        action: '',
        blogs: []
    };

    componentDidMount() {
        this.getBlogs();
    }

    getBlogs() {
        this.props.onShowLoading(true, 1);
        BlogService.getAllBlogs()
            .then(res => {
                this.setState({ blogs: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in loading blogs data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getHeader() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h3>Blogs</h3>
                    </div>
                    <div className="row form-group mt-2">
                        <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            <button className="btn btn-primary" onClick={this.handleCreateNewBlogBtnClicked}>Create New Blog</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    getBlogsTable() {
        const { blogs } = this.state;
        if (blogs.length > 0) {
            return (
                <BlogsTable
                 blogs={blogs}
                 totalItems={blogs.length}
                 onViewBtnClicked={this.handleViewBlogBtnClicked.bind(this)}
                 onUpdateBtnClicked={this.handleUpdateBtnClicled.bind(this)}
                 onDeleteBtnClicked={this.handleDeleteBtnClicled.bind(this)}
                 />
            );
        }
    }

    handleCreateNewBlogBtnClicked = () => {

    }

    handleViewBlogBtnClicked = (blogID) => {
        const { blogs } = this.state;
        let selectedBlog;
        for (let i = 0, max = blogs.length; i < max; i++) {
            if (blogs[i].blogID === blogID)
            selectedBlog = blogs[i];
        }
        this.setState({ selectedBlog: selectedBlog, action: 'view' });
    }

    handleUpdateBtnClicled = (blogID) => {
        const { blogs } = this.state;
        let selectedBlog;
        for (let i = 0, max = blogs.length; i < max; i++) {
            if (blogs[i].blogID === blogID)
            selectedBlog = blogs[i];
        }
        this.setState({ selectedBlog: selectedBlog, action: 'update' });
    }

    handleDeleteBtnClicled = (blogID) => {
        const { blogs } = this.state;
        let selectedBlog;
        for (let i = 0, max = blogs.length; i < max; i++) {
            if (blogs[i].blogID === blogID)
            selectedBlog = blogs[i];
        }
        this.setState({ selectedBlog: selectedBlog, action: 'update' });
    }

    render() {
        const { selectedBlog, action } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                {this.getHeader()}
                                {this.getBlogsTable()}
                            </div>
                        </div>
                    </div>
                </div>
                <BlogEditorModal
                 selectedBlog={selectedBlog}
                 action={action}
                 onShowLoading={this.props.onShowLoading.bind(this)}
                 onDoneLoading={this.props.onDoneLoading.bind(this)}
                />
            </React.Fragment>
        )
    }
}

export default BlogList;