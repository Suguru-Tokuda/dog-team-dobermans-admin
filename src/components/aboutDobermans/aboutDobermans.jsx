import React, { Component } from 'react';
import { connect } from 'react-redux';
import AboutDobermansEditorModal from './aboutDobermansEditorModal';
import AboutDobermanService from '../../services/aboutDobermanService';
import toastr from 'toastr';
import $ from 'jquery';
import AboutUsService from '../../services/aboutUsService';

class AboutDobermans extends Component {
    state = {
        aboutDobermans: '',
        isEditing: false
    };

    constructor(props) {
        super(props);
        const { authenticated } = props;
        if (authenticated === false) {
            props.history.push('/login');
        }
    }

    componentDidMount() {
        if (this.props.authenticated === true)
            this.handleUpdateData();
    }

    handleEditBtnClicked = () => {
        $('#aboutDobermansEditorModal').modal('show');
    }

    handleUpdateData = () => {
        this.props.showLoading({ reset: true, count: 1 });
        AboutUsService.getAboutDobermans()
            .then(res => {
                this.setState({ aboutDobermans: res.data })
            })
            .catch((err) => {
                console.log(err);
                toastr.error('There was an error in loading about dobermans data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    render() {
        const { aboutDobermans } = this.state;
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        <h3>About Dobermans</h3>
                    </div>
                    <div className="card-body">
                        <div dangerouslySetInnerHTML={{ __html: aboutDobermans }} />
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={this.handleEditBtnClicked}>Edit</button>
                    </div>
                </div>
                <AboutDobermansEditorModal {...this.props} body={aboutDobermans} onUpdateData={this.handleUpdateData} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutDobermans);