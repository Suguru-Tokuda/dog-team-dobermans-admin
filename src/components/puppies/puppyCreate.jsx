import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyInitialForm from './puppyInitialForm';
import PuppyPictureForm from './puppyPictureForm';
import PuppyConfirmation from './puppyConfirmation';

class PuppyCreate extends Component {
    state = {
        initialParams: {},
        pictures: []
    }

    handleNextBtnClicked = (initialParams) => {
        this.setState({ initialParams });
    }

    handleConfBtnClicked = (pictures) => {
        this.setState({ pictures });
    }

    render() {
        const url = this.props.url;
        return (
            <React.Fragment>
                <Route path={`${url}/initial-params`} render={(props) => <PuppyInitialForm {...props} initlaParams={this.state.initialParams} onNextBtnClicked={this.handleNextBtnClicked.bind(this)} />} />
                <Route path={`${url}/pictures`} render={(props) => <PuppyPictureForm {...props} onHandleConfBtnClicked={this.handleConfBtnClicked.bind(this)} />} />
                <Route path={`${url}/confirmation`} render={(props) => <PuppyConfirmation {...props} initialParams={this.state.initialParams} />} />
            </React.Fragment>
        );
    }
}

export default PuppyCreate;