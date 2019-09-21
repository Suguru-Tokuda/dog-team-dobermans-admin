import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Main from './components/main/main';
import Puppies from './components/puppies/puppies';
import Puppy from './components/puppies/puppy';
import Parents from './components/parents/parents';
import Farm from './components/farm/farm';
import ContactUs from './components/contactus/contactus';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="main">
              <div className="container-fluid">
                <Switch>
                  <Route path="/" exact render={(props) => <Main {...props} />} />
                  <Route path="/puppies" exact render={(props) => <Puppies {...props} />} />
                  <Route path="/puppy" render={(props) => <Puppy url="/puppy" {...props} />} />
                  <Route path="/parents" exact render={(props) => <Parents {...props} />} />
                  <Route path="/farm" exact render={(props) => <Farm {...props} />} />
                  <Route path="/contactus" exact render={(props) => <ContactUs {...props} />} />
                </Switch>
              </div>
            </main>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
