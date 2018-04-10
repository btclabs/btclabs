import React, { Component } from 'react';
import { connect } from 'react-redux';
import Simulator from '../Simulator';
import RollHistory from '../RollHistory';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class FreebitcoinHiLoSimulatorHome extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>
                Freebitcoin HI LO Simulator
              </h1>
              <h3>
                {"For both "}
                <a href="https://freebitco.in/?r=13203612" target="_blank">freebitcoin</a>
                {" and "}
                <a href="https://freedoge.co.in/?r=2373621" target="_blank">freedogecoin</a>
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
          <br />
          <hr />
          <br />
          <Row>
            <Col xs={12}>
              <h2>
                How do I know if the simulation is accurate?
              </h2>
              <div>
                {"This simulator is based on the available disclosed information from "}
                <a href="https://freebitco.in/?r=13203612" target="_blank">freebitco.in</a>
                {" and "}
                <a href="https://freedoge.co.in/?r=2373621" target="_blank">freedoge.co.in</a>
                {"."}
                <br />
                {"You can view the source code "}
                <a href="https://github.com/btclabs/btclabs/tree/master" target="_blank">here</a>
                {"."}
              </div>
              <br />
              <br />
              <h2>
                You found a bug?
              </h2>
              <div>
                {"Report an issue "}
                <a href="https://github.com/btclabs/btclabs/issues" target="_blank">here</a>
                {"."}
              </div>
              <br />
              <br />
              <h2>
                What apps do you want next?
              </h2>
              <div>
                {"Write you suggestions "}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSei7JsNBA_8JDSp2PNn75v3UZJfU-PUHPlcRyMonVCPpqeNww/viewform?usp=sf_link" target="_blank">here</a>
                {"."}
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
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
)(FreebitcoinHiLoSimulatorHome);
