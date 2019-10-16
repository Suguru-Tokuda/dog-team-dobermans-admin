import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyInitialForm from './puppyInitialForm';
import PuppyPictureForm from './puppyPictureForm';
import PuppyConfirmation from './puppyConfirmation';

class PuppyCreate extends Component {
    state = {
        puppyId: '',
        initialParams: {},
        pictures: [],
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        if (props.puppyId !== undefined) {
            this.state.puppyId = props.puppyId;
        }
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
                                        initlaParams={this.state.initialParams}
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
                                            puppyId={this.state.puppyid} 
                                            onShowLoading={this.props.onShowLoading.bind(this)} 
                                            onDoneLoading={this.props.onDoneLoading.bind(this)} 
                />} />
            </React.Fragment>
        );
    }
}

export default PuppyCreate;