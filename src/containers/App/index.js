import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../Home';
import FreebitcoinHiLoSimulatorHome from '../FreebitcoinHiLoSimulatorHome';
import ReactGA from 'react-ga';
import debounce from 'lodash/debounce';

ReactGA.initialize('UA-108802756-3', {
  debug: true,
});

const logDebouncedPageView = debounce(() => {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}, 1000);

const logPageView = () => {
  logDebouncedPageView();
  return null;
};

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path={process.env.PUBLIC_URL + "/"} component={logPageView} />
          <Switch>
            <Route exact path={process.env.PUBLIC_URL + "/"} component={Home} />
            <Route exact path={process.env.PUBLIC_URL + "/freebitcoin-hi-lo-simulator"} component={FreebitcoinHiLoSimulatorHome} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect(
  state => ({
  }),
  {
  }
)(App);
