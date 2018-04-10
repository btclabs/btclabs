import React, { Component } from 'react';
import { connect } from 'react-redux';
import Simulator from '../Simulator';
import RollHistory from '../RollHistory';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class Home extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>
                btclabs
              </h1>
              <a href="/freebitcoin-hi-lo-simulator">Freebitcoin HI LO Simulator</a>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
    };
  },
  {
  }
)(Home);
