import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import SuperstitionPage from './SuperstitionPage'
import MapPage from './MapPage'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route exact={true} path='/from/:country' render={(props) => (
              <MapPage params={props.match.params} />
          )}/>
          <Route exact={true} path='/superstition/:id' render={(props) => (
              <SuperstitionPage params={props.match.params} />
          )}/>
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
