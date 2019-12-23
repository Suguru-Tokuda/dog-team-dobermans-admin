import React, { Component } from 'react';
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
                <NewsEditorModal {...this.props} newsBody={currentNews} onUpdateData={this.props.onUpdateData} onCancelBtnClicked={this.handleCancelEditBtnClicked} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />
            </React.Fragment>
        );
    }

}

export default News;