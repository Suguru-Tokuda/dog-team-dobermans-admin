import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { auth } from './services/firebaseService';
import Spinner from 'react-spinkit';
import AlertsService from './services/alertsService';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Login from './components/common/login';
import Main from './components/main/main';
import BannerEditor from './components/main/bannerEditor';
import Puppies from './components/puppies/puppies';
import Puppy from './components/puppies/puppy';
import Parent from './components/parents/parent';
import Parents from './components/parents/parents';
import Buyers from './components/buyers/buyers';
import Testimonials from './components/testimonials/testimonials';
import WaitRequests from './components/waitRequests/waitRequests';
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
    alertsService: null,
    authenticationChecked: false
  };

  constructor(props) {
    super(props);
    this.state.alertsService = new AlertsService();

  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const allowedUIDs = uids.allowedUIDs;
        if (allowedUIDs.indexOf(user.uid) !== -1) {
          this.props.login();
          this.props.setUser(user);
        } else {
          this.props.logout();
          this.props.unsetUser();
        }
      } else {
        this.props.logout();
        this.props.unsetUser();
    }
      this.setState({ authenticationChecked: true });
    });
  }

  componentDidUpdate() {
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
          <Spinner name="line-scale" />
        </div>
      );
    }
  }

  render() {
    const { authenticated, authenticationChecked } = this.state;
    return (
      <BrowserRouter>
        <div className={`app ${this.getUIBlockerClass()}`}>
          <Sidebar authenticated={authenticated} />
          <div className="c-wrapper">
          <Header authenticated={authenticated} />
            <div className="c-body">
              <main className="c-main">
                <div className="container-fluid">
                  {authenticationChecked === true && (
                    <Switch>
                        <Route path="/" exact render={(props) => <Main {...props} authenticated={authenticated} />} />
                        <Route path="/login" exact render={(props) => <Login {...props} authenticated={authenticated} />} />
                        <Route path="/banner" exact render={(props) => <BannerEditor {...props} authenticated={authenticated} />} />
                        <Route path="/background-vide-editor" exact render={(props) => <VideoBackgroundEditor {...props} authenticated={authenticated} />} />
                        <Route path="/gallery-image-editor" exact render={(props) => <GalleryImageEditor {...props} authenticated={authenticated} />} />
                        <Route path="/puppy" render={(props) => <Puppy url="/puppy" {...props} authenticated={authenticated} />} />
                        <Route path="/puppies" exact render={(props) => <Puppies {...props} authenticated={authenticated} />} />
                        <Route path="/parent" render={(props) => <Parent url="/parent" {...props} authenticated={authenticated} />} />
                        <Route path="/parents" exact render={(props) => <Parents {...props} authenticated={authenticated} />} />
                        <Route path="/buyers" exact render={(props) => <Buyers {...props} authenticated={authenticated} />} />
                        <Route path="/testimonials" render={(props) => <Testimonials {...props} authenticated={authenticated} />} />
                        <Route path="/wait-list" render={(props) => <WaitRequests {...props} authenticated={authenticated} />} />
                        <Route path="/about-dobermans" exact render={(props) => <AboutDobermans {...props} authenticated={authenticated} />} />
                        <Route path="/about-us" render={(props) => <AboutUs {...props} authenticated={authenticated} url="/about-us" />} />
                        <Route path="/blog" render={(props) => <Blog {...props} authenticated={authenticated} />} />
                        <Route path="/contact" render={(props) => <Contact url="/contact" {...props} authenticated={authenticated} />} />
                        <Route render={(props) => <NotFound {...props} />} />
                    </Switch>
                  )}
                  {this.getSpinner()}
                </div>
              </main>
            </div>
          </div>
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