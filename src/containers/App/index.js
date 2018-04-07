import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../Home';

class App extends Component {
  render() {
    return (
      <Home />
    );
  }
}

export default connect(
  state => ({
  }),
  {
  }
)(App);

