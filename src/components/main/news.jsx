import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewsEditorModal from './newsEditorModal';
import $ from 'jquery';

class News extends Component {
    state = {
        currentNews: '',
    };

    constructor(props) {
        super(props);
        this.state.currentNews = props.news;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.news !== prevState.currentNews) {
            return { currentNews: nextProps.news };
        }
        return null;
    }

    handleEditBntClicked = () => {
        $('#newsEditorModal').modal('show');
    }

    handleCancelEditBtnClicked() {
        $('#newsEditorModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    render() {
        const { currentNews } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h3>News</h3>
                    </div>
                    <div className="card-body">
                        <div dangerouslySetInnerHTML={{ __html: currentNews }}></div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={this.handleEditBntClicked}>Edit</button>
                    </div>
                </div>
                <NewsEditorModal {...this.props} newsBody={currentNews} onUpdateData={this.props.onUpdateData} onCancelBtnClicked={this.handleCancelEditBtnClicked}  />
            </React.Fragment>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(News);