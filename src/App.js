import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { auth } from './services/firebaseService';
import Spinner from 'react-spinkit';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Login from './components/common/login';
import PasswordForgot from './components/common/passwordForgot';
import Main from './components/main/main';
import BannerEditor from './components/main/bannerEditor';
import Puppies from './components/puppies/puppies';
import Puppy from './components/puppies/puppy';
import Parent from './components/parents/parent';
import Parents from './components/parents/parents';
import Buyers from './components/buyers/buyers';
import Testimonials from './components/testimonials/testimonials';
import WaitRequests from './components/waitRequests/waitRequests';
import Messages from './components/messages/messages';
import AboutDobermans from './components/aboutDobermans/aboutDobermans';
import AboutUs from './components/aboutUs/aboutUs';
import Blog from './components/blog/blog';
import Contact from './components/contact/contact';
import NotFound from './components/common/notFound';
import $ from 'jquery';
import VideoBackgroundEditor from './components/main/videoBackgroundEditor';
import GalleryImageEditor from './components/main/galleryImageEditor';
import * as uids from './allowedUIDs.json';

class App extends Component {

  state = {
    isLoading: false,
    authenticationChecked: false
  };

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const allowedUIDs = uids.allowedUIDs;
        this.props.login();
        this.props.setUser(user);
        // if (allowedUIDs.indexOf(user.uid) !== -1) {
          // this.props.login();
          // this.props.setUser(user);
        // } else {
        //   this.props.logout();
        //   this.props.unsetUser();
        // }
      } else {
        this.props.logout();
        this.props.unsetUser();
    }
      this.setState({ authenticationChecked: true });
    });
  }

  componentDidUpdate(props) {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
  }

  getUIBlockerClass() {
    return (this.props.loadCount > 0 ? 'block-screen' : '');
  }

  getSpinner = () => {
    if (this.props.loadCount > 0) {
      return (
        <div className="centered">
          <Spinner name="line-spin-fade-loader" />
        </div>
      );
    }
  }

  render() {
    const { authenticationChecked } = this.state;
    const { authenticated } = this.props;

    return (
      <BrowserRouter>
        <div className={`app ${this.getUIBlockerClass()}`}>
          <Route render={(props) => <Sidebar {...props} /> }/>
          <div className="c-wrapper">
            <Route render={(props) => <Header {...props} /> }/>
            <div className="c-body">
              <main className="c-main">
                <div className="container-fluid">
                  {authenticationChecked === true && (
                    <Switch>
                        <Route path="/" exact render={(props) => <Main {...props} />} />
                        <Route path="/login" exact render={(props) => <Login {...props} />} />
                        <Route path="/password-reset" exact render={(props) => <PasswordForgot {...props} />} />
                        <Route path="/banner" exact render={(props) => <BannerEditor {...props} />} />
                        <Route path="/background-vide-editor" exact render={(props) => <VideoBackgroundEditor {...props} />} />
                        <Route path="/gallery-image-editor" exact render={(props) => <GalleryImageEditor {...props} />} />
                        <Route path="/puppy" render={(props) => <Puppy url="/puppy" {...props} />} />
                        <Route path="/puppies" exact render={(props) => <Puppies {...props} />} />
                        <Route path="/parent" render={(props) => <Parent url="/parent" {...props} />} />
                        <Route path="/parents" exact render={(props) => <Parents {...props} />} />
                        <Route path="/customers" exact render={(props) => <Buyers {...props} />} />
                        <Route path="/testimonials" render={(props) => <Testimonials {...props} />} />
                        <Route path="/wait-list" render={(props) => <WaitRequests {...props} />} />
                        <Route path="/messages" render={(props) => <Messages {...props} />} />
                        <Route path="/about-dobermans" exact render={(props) => <AboutDobermans {...props} />} />
                        <Route path="/about-us" render={(props) => <AboutUs {...props} url="/about-us" />} />
                        <Route path="/blog" render={(props) => <Blog {...props} />} />
                        <Route path="/contact" render={(props) => <Contact url="/contact" {...props} />} />
                        <Route render={(props) => <NotFound {...props} />} />
                    </Switch>
                  )}
                </div>
              </main>
            </div>
          </div>
          {this.getSpinner()}
        </div>
      </BrowserRouter>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);