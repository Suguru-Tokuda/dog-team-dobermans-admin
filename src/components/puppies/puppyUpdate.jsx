import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyUpdateSelection from './puppyUpdateSelection';
import PuppyCreateForm from './puppyInitialForm';
import PuppyPictureUpdateForm from './puppyPictureUpdateForm';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class PuppyUpdate extends Component {
    state = {
        url: '',
        puppyID: '',
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        this.state.url = props.url;
        this.state.puppyID = props.match.params.puppyID;
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        ParentsService.getAllParents()
            .then(res => {
                if (res.data.length > 0) {
                    const dads = [];
                    const moms = [];
                    res.data.forEach(parent => {
                        if (parent.sex === 'male')
                            dads.push(parent);
                        else if (parent.sex === 'female')
                            moms.push(parent);
                        });
                    dads.sort((a, b) => {
                        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
                    });
                    moms.sort((a, b) => {
                        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
                    });
                    if (dads.length === 0 || moms.length === 0) {
                        toastr.error('Please register at least two parents (dad and mom) to register a new puppy');
                        this.props.history.push('/puppies');
                    } else {
                        this.setState({ dads, moms });
                    }
                } else {
                    toastr.error('Please register at least two parents (dad and mom) to register a new puppy');
                    this.props.history.push('/puppies');
                }
            })
            .catch(() => {
                toastr.error('There was an error in fetching parents data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    handleCancleClicked = () => {
        const { puppyID } = this.state;
        this.props.history.push(`/puppy/update/${puppyID}`);
    }

    render() {
        const url = `${this.state.url}/update`;
        const { puppyID, dads, moms } = this.state;
        return (
            <React.Fragment>
                <Route path={`${url}/:puppyID`} exact render={(props) => <PuppyUpdateSelection {...props} url={url} puppyID={puppyID} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
                <Route path={`${url}/profile/:puppyID`} render={(props) => <PuppyCreateForm {...props} url={url} puppyID={puppyID} dads={dads} moms={moms} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} onCancelBtnClicked={this.handleCancleClicked} />} />
                <Route path={`${url}/pictures/:puppyID`} render={(props) => <PuppyPictureUpdateForm {...props} url={url} onShowLoading={this.props.onShowLoading.bind(this)} onDoneLoading={this.props.onDoneLoading.bind(this)} />} />
            </React.Fragment>
        );
    }
}

export default PuppyUpdate;