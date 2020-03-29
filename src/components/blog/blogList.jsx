import React, { Component } from 'react';
import BlogsTable from './blogsTable';
import BlogService from '../../services/blogService';
import $ from 'jquery';
import toastr from 'toastr';

class BlogList extends Component {
    state = {
        selectedBlog: null,
        blogs: [],
        dataLoaded: false
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
            .catch(() => {
                toastr.error('There was an error in loading blogs data');
            })
            .finally(() => {
                this.setState({ dataLoaded: true });
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
                </div>
                <div className="row form-group mt-2">
                    <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                        <button className="btn btn-primary" onClick={this.handleCreateNewBlogBtnClicked}>Create New Blog</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    getBlogsTable() {
        const { blogs, dataLoaded } = this.state;
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
        } else if (blogs.length === 0 && dataLoaded === true ) {
            return <h3>No blogs available</h3>;
        }
    }

    handleCreateNewBlogBtnClicked = () => {
        this.props.history.push('/blog/create');
    }

    handleViewBlogBtnClicked = (blogID) => {
        this.props.history.push(`/blog/view/${blogID}`)
    }

    handleUpdateBtnClicled = (blogID) => {
        this.props.history.push(`/blog/update/${blogID}`)
    }

    handleDeleteBtnClicled = (blogID) => {
        this.props.history.push(`/blog/delete/${blogID}`)
    }

    handleUpdateData = () => {
        this.getBlogs();
    }

    handleCancelBtnClicked = () => {
        this.setState({
            selectedBlog: null,
            action: ''
        });
        $('#blogEditorModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    render() {
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
            </React.Fragment>
        )
    }
}

export default BlogList;