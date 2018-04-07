import React, { Component } from 'react';
import { connect } from 'react-redux';
import Simulator from '../Simulator';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';


class Home extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} md={10}>
              <Simulator />
            </Col>
            <Col xs={12} md={2}>
              <div>
                What is this? This is a simulator for the game in freebitco.in and freedoge.co.in.
              </div>
              <br />
              <div>
                Need an account? Use the following referral links to register and you will get referral share according to the scheduled dates shown in the table.
              </div>
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
