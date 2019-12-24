import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BlogTable from './blogTable';
import BlogEditorModal from './blogEditorModal';
import BlogService from '../../services/blogService';
import toastr from 'toastr';

class BlogList extends Component {
    state = {
        blogToDelete: '',
        blogs: []
    };

    componentDidMount() {
        this.getBlogs();
    }

    getBlogs() {
        this.props.onShowLoadiing(true, 1);
        Blog
    }
}