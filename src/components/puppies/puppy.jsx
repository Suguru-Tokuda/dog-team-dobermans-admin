import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyDetail from './puppyDetail';
import PuppyCreate from './puppyCreate';
import PuppyUpdate from './puppyUpdate';

class Puppy extends Component {

    state = {
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    render() {
        const url = this.props.url;
        return (
            <React.Fragment>
                <Route path={`${url}/view/:id`} render={(props) => <PuppyDetail {...props} />} />
                <Route path={`${url}/create`} render={(props) => <PuppyCreate {...props} url={`${url}/create`} />} />
                <Route path={`${url}/update/:id`} render={(props) => <PuppyUpdate {...props} />} />
            </React.Fragment>
        )
    }
}

export default Puppy;