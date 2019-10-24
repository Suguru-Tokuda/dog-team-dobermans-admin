import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyInitialForm from './puppyInitialForm';
import PuppyPictureForm from './puppyPictureForm';
import PuppyConfirmation from './puppyConfirmation';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class PuppyCreate extends Component {
    state = {
        puppyID: '',
        initialParams: {},
        pictures: [],
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        if (props.puppyID !== undefined) {
            this.state.puppyID = props.puppyID;
        }
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

    handleNextBtnClicked = (initialParams) => {
        this.setState({ initialParams });
    }

    handleConfBtnClicked = (pictures) => {
        this.setState({ pictures });
    }

    handleCancelClicked = () => {
        this.setState({
            initialParams: {},
            pictures: [],
        });
        this.props.history.push('/puppies');
    }

    render() {
        const url = this.props.url;
        const { dads, moms } = this.state;
        return (
            <React.Fragment>
                <Route 
                    path={`${url}/initial-params`} 
                    render={(props) => <PuppyInitialForm {...props} 
                                        initialParams={this.state.initialParams}
                                        dads={dads}
                                        moms={moms}
                                        onToPictureBtnClicked={this.handleNextBtnClicked.bind(this)} 
                                        onCancelBtnClicked={this.handleCancelClicked} 
                                        onShowLoading={this.props.onShowLoading.bind(this)} 
                                        onDoneLoading={this.props.onDoneLoading.bind(this)} />}
                />
                <Route 
                    path={`${url}/pictures`} 
                    render={(props) => <PuppyPictureForm {...props} 
                                        onToConfirmBtnClicked={this.handleConfBtnClicked.bind(this)} 
                                        initialParams={this.state.initialParams} 
                                        pictures={this.state.pictures}
                                        onShowLoading={this.props.onShowLoading.bind(this)} 
                                        onDoneLoading={this.props.onDoneLoading.bind(this)} />} 
                />
                <Route 
                    path={`${url}/confirmation`} 
                    render={(props) => <PuppyConfirmation {...props} 
                                            dads={this.state.dads} 
                                            moms={this.state.moms} 
                                            initialParams={this.state.initialParams} 
                                            pictures={this.state.pictures} 
                                            onCancelBtnClicked={this.handleCancelClicked} 
                                            puppyID={this.state.puppyID} 
                                            onShowLoading={this.props.onShowLoading.bind(this)} 
                                            onDoneLoading={this.props.onDoneLoading.bind(this)} 
                />} />
            </React.Fragment>
        );
    }
}

export default PuppyCreate;