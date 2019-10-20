import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyUpdateSelection from './puppyUpdateSelection';
import PuppyCreateForm from './puppyInitialForm';
import PuppyPictureUpdateForm from './puppyPictureUpdateForm';

class PuppyUpdate extends Component {
    state = {
        url: '',
        puppyId: '',
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.puppyId = props.match.params.puppyId;
    }

    componentDidMount() {
        // API call to get parents
        this.setState({
            dads: [
                { parentId: 1, name: 'Dad 1' },
                { parentId: 2, name: 'Dad 2' },
                { parentId: 3, name: 'Dad 3' }
            ],
            moms: [
                { parentId: 4, name: 'Mom 1' },
                { parentId: 5, name: 'Mom 2' },
                { parentId: 6, name: 'Mom 3' }
            ]
        });
    }

    handleCancleClicked = () => {
        const { puppyId } = this.state;
        this.props.history.push(`/puppy/update/${puppyId}`);
    }

    render() {
        const url = `${this.state.url}/update`;
        const { puppyId, dads, moms } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}/:puppyId`} exact render={(props) => <PuppyUpdateSelection {...props} url={url} puppyId={this.state.puppyId} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/profile/:puppyId`} render={(props) => <PuppyCreateForm {...props} url={url} puppyId={puppyId} dads={dads} moms={moms}  onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} onCancelBtnClicked={this.handleCancleClicked} />} />
                <Route path={`${url}/pictures/:puppyId`} render={(props) => <PuppyPictureUpdateForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdate;