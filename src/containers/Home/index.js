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
                HI LO Simulator
              </h1>
              <h3>
                For <a href="https://freebitco.in/?r=13203612">freebitco.in</a> and <a href="https://freedoge.co.in/?r=2373621">freedoge.co.in</a>
              </h3>
              <br />
              <br />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Simulator />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <RollHistory />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h2>
                Source code?
              </h2>
              <h2>
                Any other web app that you want me to build?
              </h2>
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
