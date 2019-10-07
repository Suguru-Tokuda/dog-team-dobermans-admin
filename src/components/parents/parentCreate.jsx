import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ParentInitialForm from './parentInitialForm';
import ParentPictureForm from './parentPictureForm';
import ParentConfirmation from './parentConfirmation';

class ParentCreate extends Component {
    state = {
        initialParams: {},
        pictures: []
    };

    handleNextBtnClicked = (initialParams) => {
        this.setState({ initialParams });
    }

    handleConfBtnClicked = (pictures) => {
        this.setState({ pictures });
    }

    handleCancelClicked = () => {
        this.setState({
            initialParams: {},
            pictures: []
        });
    }

    render() {
        const { url } = this.props;
        return (
            <React.Fragment>
                <Route path={`${url}/initial-params`} render={(props) => <ParentInitialForm {...props} initialParams={this.state.initialParams} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/pictures`} render={(props) => <ParentPictureForm {...props} initialParams={this.state.initialParams} pictures={this.state.pictures} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/confirmation`} render={(props) => <ParentConfirmation {...props} initialParams={this.state.initialParams} pictures={this.state.pictures} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default ParentCreate;