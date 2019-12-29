import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PuppyDetail from './puppyDetail';
import PuppyCreate from './puppyCreate';
import PuppyUpdate from './puppyUpdate';
import PuppySalesForm from './puppySalesForm';

class Puppy extends Component {
    state = {
        url: ''
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
    }

    render() {
        const { url } = this.state;
        const { authenticated } = this.state;
        if (authenticated === true) {
            return (
                <React.Fragment>
                    <Route path={`${url}/view/:puppyID`} render={(props) => <PuppyDetail {...props} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path={`${url}/create`} render={(props) => <PuppyCreate {...props} url={`${url}/create`} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path={`${url}/update/:puppyID`} render={(props) => <PuppyUpdate {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                    <Route path={`${url}/sales/:puppyID`} render={(props) => <PuppySalesForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                </React.Fragment>
            );
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default Puppy;