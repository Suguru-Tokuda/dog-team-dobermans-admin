import React, { Component } from 'react';
import BlogsTable from './blogsTable';
import BlogService from '../../services/blogService';
import { connect } from 'react-redux';
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
        this.props.showLoading({ reset: true, count: 1 });
        BlogService.getAllBlogs()
            .then(res => {
                this.setState({ blogs: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading blogs data');
            })
            .finally(() => {
                this.setState({ dataLoaded: true });
                this.props.doneLoading({ reset: true });
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogList);