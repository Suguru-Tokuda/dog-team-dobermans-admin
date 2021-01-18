import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
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
        moms: [],
        dadtaLoaded: false
    };

    constructor(props) {
        super(props);
        if (props.puppyID !== undefined) {
            this.state.puppyID = props.puppyID;
        }
    }

    componentDidMount() {
        this.props.showLoading({ reset: true, count: 1 });
        ParentsService.getAllParents()
            .then(res => {
                if (res.data.length > 0) {
                    const dads = [];
                    const moms = [];
                    res.data.forEach(parent => {
                        if (parent.gender === 'male')
                            dads.push(parent);
                        else if (parent.gender === 'female')
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
                this.props.doneLoading({ reset: true });
                this.setState({ dadtaLoaded: true });
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
        const { dads, moms, dadtaLoaded } = this.state;
        if (dadtaLoaded === true) {
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
                                            />}
                    />
                    <Route 
                        path={`${url}/pictures`} 
                        render={(props) => <PuppyPictureForm {...props} 
                                            onToConfirmBtnClicked={this.handleConfBtnClicked.bind(this)} 
                                            initialParams={this.state.initialParams} 
                                            pictures={this.state.pictures}
                                            />} 
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
                    />} />
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount
  });
  
const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        logout: () => dispatch({ type: 'SIGN_OUT' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        unsetUser: () => dispatch({ type: 'UNSET_USER' }),
        getUser: () => dispatch({ type: 'GET_USER' }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PuppyCreate);