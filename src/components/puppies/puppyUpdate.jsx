import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyUpdateSelection from './puppyUpdateSelection';
import PuppyCreateForm from './puppyInitialForm';
import PuppyPictureForm from './puppyPictureForm';

class PuppyUpdate extends Component {
    state = {
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    render() {
        return (
            <React.Fragment>
                <Route path={`${this.props.url}`} exact render={() => <PuppyUpdateSelection />} />
                <Route path={`${this.props.url}/profile`} render={() => <PuppyCreateForm />} />
                <Route path={`${this.props.url}/picture`} render={() => <PuppyPictureForm />} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdate;