import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Spinner from 'react-spinkit';
import AlertsService from './services/alertsService';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Main from './components/main/main';
import Puppies from './components/puppies/puppies';
import Puppy from './components/puppies/puppy';
import Parent from './components/parents/parent';
import Parents from './components/parents/parents';
import Buyers from './components/buyers/buyers';
import Testimonials from './components/testimonials/testimonials';
import WaitList from './components/waitList/waitList';
import AboutUs from './components/aboutUs/aboutUs';
import Blog from './components/blog/blog';
import Contact from './components/contact/contact';

class App extends Component {

  state = {
    isLoading: false,
    alertsService: null
  };

  constructor(props) {
    super(props);
    this.state.alertsService = new AlertsService();
  }
  
  showLoading(resetCount, count) {
    const isLoading = this.state.alertsService.showLoading(resetCount, count) !== 0;
    this.setState({ isLoading });
  }

  doneLoading(override) {
    const isLoading = this.state.alertsService.doneLoading(override) !== 0;
    this.setState({ isLoading });
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
    return (
      <BrowserRouter>
        <div className={`app ${this.getUIBlockerClass()}`}>
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="main">
              <div className="container-fluid">
                <Switch>
                  <Route path="/" exact render={(props) => <Main {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/puppy" render={(props) => <Puppy url="/puppy" {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/puppies" exact render={(props) => <Puppies {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/parent" render={(props) => <Parent url="/parent" {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/parents" exact render={(props) => <Parents {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/buyers" exact render={(props) => <Buyers {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/testimonials" exact render={(props) => <Testimonials {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/wait-list" exact render={(props) => <WaitList {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/about-us" render={(props) => <AboutUs {...props} url="/about-us" onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/blog" render={(props) => <Blog {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
                  <Route path="/contact" render={(props) => <Contact url="/contact" {...props} onShowLoading={this.showLoading.bind(this)} onDoneLoading={this.doneLoading.bind(this)} />} />
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
