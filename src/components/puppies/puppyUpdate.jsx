import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PuppyUpdateSelection from './puppyUpdateSelection';
import PuppyCreateForm from './puppyInitialForm';
import PuppyPictureUpdateForm from './puppyPictureUpdateForm';
import ParentService from '../../services/parentService';
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
        this.props.showLoading({ reset: true, count: 1 });
        ParentService.getAllParents()
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
                <Route path={`${url}/:puppyID`} exact render={(props) => <PuppyUpdateSelection {...props} url={url} puppyID={puppyID}  />} />
                <Route path={`${url}/profile/:puppyID`} render={(props) => <PuppyCreateForm {...props} url={url} puppyID={puppyID} dads={dads} moms={moms}  onCancelBtnClicked={this.handleCancleClicked} />} />
                <Route path={`${url}/pictures/:puppyID`} render={(props) => <PuppyPictureUpdateForm {...props} url={url}  />} />
            </React.Fragment>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(PuppyUpdate);