import React, { Component } from 'react';
import { connect } from 'react-redux';
import seedrandom from 'seedrandom';
import { addResult } from '../../actions'
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Radio from 'react-bootstrap/lib/Radio';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';

class Simulator extends Component {
  componentDidMount() {
    // On screen info - Start
    this.balance = 100000;

    this.baseBet = 1;
    this.maxBetWin = 20;
    this.betOdds = 2;
    this.winChance = (1/this.betOdds)*0.95;
    this.noOfRolls = 100;
    this.betOnHi = false;
    this.betOnLo = false;
    this.betOnAlternate = true;
    this.stopProfit = 0;
    this.stopLoss = 0;

    this.onWinReturnToBaseBet = true;
    this.onWinIncreaseBet = false;
    this.onWinIncreaseBetBy = 0.00;
    this.onWinChangeOdds = false;
    this.onWinChangeOddsTo = 2;

    this.onLoseReturnToBaseBet = true;
    this.onLoseIncreaseBet = false;
    this.onLoseIncreaseBetBy = 0.0;
    this.onLoseChangeOdds = false;
    this.onLoseChangeOddsTo = 2;

    this.onHittingMaxBetWinReturnToBaseBet = true;
    this.onHittingMaxBetWinStopBetting = true;
    this.randomizeClientSeed = false;
    this.randomRoll = 0;

    this.prize1Selected = false;
    this.prizePoint1Selected = false;
    this.prizePoint01Selected = false;
    this.prizePoint001Selected = false;
    this.prizePoint0001Selected = false;
    // On screen info - End


    this.maxRandom = 10000;
    this.getRandomSeed = seedrandom();

/*
var randomArray = generateRandomArray(noOfRolls, maxRandom);

var winChance = (1/betOdds)*0.95;
var lowerThanThisToWin = Math.round(winChance * maxRandom);

var profitOrLoss = 0;
var rolled = 0;

var originalBalance = balance;
var wager = baseBet;
var maxNoOfLosesInARoll = 0;
var noOfLosesInARoll = 0;

var warning = '';
*/
  }

  onStartAutoBet = () => {
    this.randomizeRoll();
    this.props.addResult(this.randomRoll);
  }

  randomizeRoll = () => {
    if (this.randomizeClientSeed) {
      this.randomRoll = Math.floor(seedrandom(this.getRandomSeed())() * (this.maxRandom + 1));
    } else {
      this.randomRoll = Math.floor(seedrandom()() * (this.maxRandom + 1));
    }
  }

  renderOnWinOrLose = () => {
    return (
      <div>
        <FormGroup validationState="success">
          <Col xs={12}>
            <Checkbox>
              RETURN TO BASE BET
            </Checkbox>
          </Col>
        </FormGroup>
        <FormGroup validationState="success">
          <Col xs={6}>
            <Checkbox>
              INCREASE BET BY
            </Checkbox>
          </Col>
          <Col xs={6}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="INCREASE BET BY"
              />
              <InputGroup.Addon>
                %
              </InputGroup.Addon>
            </InputGroup>
          </Col>
        </FormGroup>
        <Clearfix />
        <FormGroup validationState="success">
          <Col xs={6}>
            <Checkbox>
              LOSS >=
            </Checkbox>
          </Col>
          <Col xs={6}>
            <FormControl
              type="text"
              placeholder="LOSS >="
            />
          </Col>
        </FormGroup>
      </div>
    )
  }

  renderJackpotRow = (prize, cost) => {
    return (
      <tr>
        <td>
          <Checkbox>
          </Checkbox>
        </td>
        <td>{prize}</td>
        <td>{cost}</td>
      </tr>
    )
  }

  render() {
    return (
      <div>
        <form>
          <Tabs defaultActiveKey={1} id="manual-or-auto-tabs">
            <Tab eventKey={1} title="MANUAL BET">
              <br />
            </Tab>
            <Tab eventKey={2} title="AUTO BET">
              <br />
              <Row>
                <Col xs={12} sm={6} md={4}>
                  <FormGroup validationState="success">
                    <Col xs={5}>
                      <ControlLabel>
                        BASE BET
                      </ControlLabel>
                    </Col>
                    <Col xs={7}>
                      <FormControl
                        type="text"
                        placeholder="BASE BET"
                      />
                      <HelpBlock>
                        Help text with validation state.
                      </HelpBlock>
                    </Col>
                  </FormGroup>
                  <FormGroup validationState="success">
                    <Col xs={5}>
                      <ControlLabel>
                        MAX BET/WIN
                      </ControlLabel>
                    </Col>
                    <Col xs={7}>
                      <FormControl
                        type="text"
                        placeholder="MAX BET/WIN"
                      />
                      <HelpBlock>
                        Help text with validation state.
                      </HelpBlock>
                    </Col>
                  </FormGroup>
                  <Row>
                    <Col xs={6}>
                      <FormGroup validationState="success">
                        <ControlLabel>
                          BET ODDS
                        </ControlLabel>
                        <FormControl
                          type="text"
                          placeholder="BET ODDS"
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <FormGroup validationState="success">
                        <ControlLabel>
                          NO. OF ROLLS
                        </ControlLabel>
                        <FormControl
                          type="text"
                          placeholder="NO. OF ROLLS"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup validationState="success">
                    <ControlLabel>
                      BET ON
                    </ControlLabel>
                    <br />
                    <Radio name="radioGroup" inline>
                      HI
                    </Radio>{' '}
                    <Radio name="radioGroup" inline>
                      LO
                    </Radio>{' '}
                    <Radio name="radioGroup" inline>
                      ALTERNATE
                    </Radio>
                  </FormGroup>
                  <FormGroup validationState="success">
                    <ControlLabel>
                      STOP BETTING AFTER
                    </ControlLabel>
                  </FormGroup>
                  <FormGroup validationState="success">
                    <Col xs={6}>
                      <Checkbox>
                        PROFIT >=
                      </Checkbox>
                    </Col>
                    <Col xs={6}>
                      <FormControl
                        type="text"
                        placeholder="PROFIT >="
                      />
                    </Col>
                  </FormGroup>
                  <Clearfix />
                  <FormGroup validationState="success">
                    <Col xs={6}>
                      <Checkbox>
                        LOSS >=
                      </Checkbox>
                    </Col>
                    <Col xs={6}>
                      <FormControl
                        type="text"
                        placeholder="LOSS >="
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md={4} mdPush={4}>
                  <Tabs defaultActiveKey={1} id="on-win-or-lose-tabs">
                    <Tab eventKey={1} title="ON WIN">
                      {this.renderOnWinOrLose()}
                    </Tab>
                    <Tab eventKey={2} title="ON LOSE">
                      {this.renderOnWinOrLose()}
                    </Tab>
                  </Tabs>
                  <br />
                  <br />
                  <br />
                  <FormGroup validationState="success">
                    <ControlLabel>
                      ON HITTING MAX BET/WIN
                    </ControlLabel>
                    <Checkbox>
                      RETURN TO BASE BET
                    </Checkbox>
                    <Checkbox>
                      STOP BETTING
                    </Checkbox>
                  </FormGroup>
                  <br />
                  <FormGroup validationState="success">
                    <Checkbox>
                      RANDOMIZE CLIENT SEED
                    </Checkbox>
                    <Checkbox disabled>
                      DO NOT REFRESH
                    </Checkbox>
                    <Checkbox disabled>
                      ENABLE SOUNDS
                    </Checkbox>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12} md={4} mdPull={4}>
                  <Well>
                    {12345}
                  </Well>
                  <Button
                    bsStyle="warning"
                    onClick={this.onStartAutoBet}
                  >
                    START AUTO-BET
                  </Button>
                  <div>
                    PLAY FOR JACKPOTS
                  </div>
                  <div>
                    Roll number 8888 to win the jackpots!
                  </div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>SELECT</th>
                        <th>PRIZE (BTC)</th>
                        <th>COST (BTC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderJackpotRow("1.00000000", "0.00012500")}
                      {this.renderJackpotRow("0.10000000", "0.00001250")}
                      {this.renderJackpotRow("0.01000000", "0.00000125")}
                      {this.renderJackpotRow("0.00100000", "0.00000013")}
                      {this.renderJackpotRow("0.00010000", "0.00000002")}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </form>
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
    addResult,
  }
)(Simulator);
