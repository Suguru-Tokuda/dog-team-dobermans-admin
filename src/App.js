import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { auth } from './services/firebaseService';
import Spinner from 'react-spinkit';
import AlertsService from './services/alertsService';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Login from './components/common/login';
import Main from './components/main/main';
import Puppies from './components/puppies/puppies';
import Puppy from './components/puppies/puppy';
import Parent from './components/parents/parent';
import Parents from './components/parents/parents';
import Buyers from './components/buyers/buyers';
import Testimonials from './components/testimonials/testimonials';
import WaitList from './components/waitList/waitList';
import AboutDobermans from './components/aboutDobermans/aboutDobermans';
import AboutUs from './components/aboutUs/aboutUs';
import Blog from './components/blog/blog';
import Contact from './components/contact/contact';
import NotFound from './components/common/notFound';

class App extends Component {

  state = {
    isLoading: false,
    alertsService: null,
    authenticated: false
  };

  constructor(props) {
    super(props);
    this.state.alertsService = new AlertsService();
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authenticated: true });
      } else {
        this.setState({ authenticated: false });
      }
    });
  }
  
  showLoading(resetCount, count) {
    const isLoading = this.state.alertsService.showLoading(resetCount, count) !== 0;
    this.setState({ isLoading });
  }

  doneLoading(override) {
    const isLoading = this.state.alertsService.doneLoading(override) !== 0;
    this.setState({ isLoading });
  }

  onLogin(isLoggedIn) {
    if (isLoggedIn === true) {
      this.setState({ authenticated: true });
    }
  }

  onSignOut(isLoggedIn) {
    if (isLoggedIn === false) {
      this.setState({ authenticated: false });
    }
  }

  getUIBlockerClass() {
    return (this.state.isLoading === true ? 'block-screen' : '');
  }

  getSpinner = () => {
    if (this.state.isLoading === true) {
      return (
        <div className="centered">
          <Spinner name="line-scale" />
        </div>
      );
    }
  }

  render() {
    const { authenticated } = this.state;
    return (
      <BrowserRouter>
        <div className={`app ${this.getUIBlockerClass()}`}>
          <Header authenticated={authenticated} onSignOut={this.onSignOut.bind(this)} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />
          <div className="app-body">
            <Sidebar authenticated={authenticated} />
            <main className="main">
              <div className="container-fluid">
                <Switch>
                  <Route path="/" exact render={(props) => <Main {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/login" exact render={(props) => <Login {...props} authenticated={authenticated} onLogin={this.onLogin.bind(this)} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/puppy" render={(props) => <Puppy url="/puppy" {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/puppies" exact render={(props) => <Puppies {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/parent" render={(props) => <Parent url="/parent" {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/parents" exact render={(props) => <Parents {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/buyers" exact render={(props) => <Buyers {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/testimonials" exact render={(props) => <Testimonials {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/wait-list" exact render={(props) => <WaitList {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/about-dobermans" exact render={(props) => <AboutDobermans {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/about-us" render={(props) => <AboutUs {...props} authenticated={authenticated} url="/about-us" onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/blog" render={(props) => <Blog {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/contact" render={(props) => <Contact url="/contact" {...props} authenticated={authenticated} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route render={(props) => <NotFound {...props} />} />
                </Switch>
                {this.getSpinner()}
              </div>
            </main>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
