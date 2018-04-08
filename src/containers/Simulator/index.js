import React, { Component } from 'react';
import { connect } from 'react-redux';
import seedrandom from 'seedrandom';
import { addResult, startAutoBet, stopAutoBet, startManualBet } from '../../actions'
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
  constructor(props) {
    super(props);
    // On screen info - Start
    this.balance = 100000;

    this.baseBet = 1;
    this.maxBetWin = 20;
    this.betOdds = 2;
    this.winChance = (1/this.betOdds)*0.95;
    this.noOfRolls = 10;
    this.betOnHi = false;
    this.betOnLo = false;
    this.betOnAlternate = true;
    this.stopBettingAfterProfit = false;
    this.stopBettingAfterProfitGreaterEqual = 0;
    this.stopBettingAfterLoss = false;
    this.stopBettingAfterLossGreaterEqual = 0;

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
    this.onHittingMaxBetWinStopBetting = false;
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulator.noOfRollsRemaining !== this.props.simulator.noOfRollsRemaining && nextProps.simulator.noOfRollsRemaining > 0) {
      this.timeoutId = setTimeout(this.handleRoll, 250);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  onStartAutoBet = () => {
    this.props.startAutoBet(this.noOfRolls);
    this.handleRoll();
  }

  onStopAutoBet = () => {
    this.props.stopAutoBet();
    clearTimeout(this.timeoutId);
  }

  onStartManualBet = () => {
    this.props.startManualBet();
  }

  handleRoll = () => {
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

  renderOnWinOrLose = (
    radioGroupName,
    returnToBaseBet,
    setReturnToBaseBet,
    increaseBet,
    setIncreaseBet,
    increaseBetBy,
    setIncreaseBetBy,
    changeOdds,
    setChangeOdds,
    changeOddsTo,
    setChangeOddsTo
  ) => {
    return (
      <div>
        <FormGroup validationState="success">
          <Col xs={12}>
            <Radio
              name={radioGroupName}
              defaultChecked={returnToBaseBet}
              onChange={(e)=>{
                setReturnToBaseBet(true);
                setIncreaseBet(false);
              }}
            >
              RETURN TO BASE BET
            </Radio>
          </Col>
        </FormGroup>
        <FormGroup validationState="success">
          <Col xs={6}>
            <Radio
              name={radioGroupName}
              defaultChecked={increaseBet}
              onChange={(e)=>{
                setReturnToBaseBet(false);
                setIncreaseBet(true);
              }}
            >
              INCREASE BET BY
            </Radio>
          </Col>
          <Col xs={6}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="INCREASE BET BY"
                defaultValue={increaseBetBy}
                onChange={(e)=>{
                  setIncreaseBetBy(e.target.value);
                }}
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
            <Checkbox
              defaultChecked={changeOdds}
              onChange={(e)=>{
                setChangeOdds(e.target.checked);
              }}
            >
              CHANGE ODDS TO
            </Checkbox>
          </Col>
          <Col xs={6}>
            <FormControl
              type="text"
              placeholder="CHANGE ODDS TO"
              defaultValue={changeOddsTo}
              onChange={(e)=>{
                setChangeOddsTo(e.target.value);
              }}
            />
          </Col>
        </FormGroup>
      </div>
    )
  }

  renderJackpotRow = (prize, cost, prizeSelected, setPrizeSelected) => {
    return (
      <tr>
        <td>
          <Checkbox
            defaultChecked={prizeSelected}
            onChange={(e)=>{
              setPrizeSelected(e.target.checked);
            }}
          >
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
                        defaultValue={this.baseBet}
                        onChange={(e)=>{this.baseBet = e.target.value}}
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
                        defaultValue={this.maxBetWin}
                        onChange={(e)=>{this.maxBetWin = e.target.value}}
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
                          defaultValue={this.betOdds}
                          onChange={(e)=>{this.betOdds = e.target.value}}
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
                          defaultValue={this.noOfRolls}
                          onChange={(e)=>{this.noOfRolls = e.target.value}}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup validationState="success">
                    <ControlLabel>
                      BET ON
                    </ControlLabel>
                    <br />
                    <Radio
                      name="radioGroupBetOn"
                      inline
                      defaultChecked={this.betOnHi}
                      onChange={(e)=>{
                        this.betOnHi = true;
                        this.betOnLo = false;
                        this.betOnAlternate = false;
                      }}
                    >
                      HI
                    </Radio>{' '}
                    <Radio
                      name="radioGroupBetOn"
                      inline
                      defaultChecked={this.betOnLo}
                      onChange={(e)=>{
                        this.betOnHi = false;
                        this.betOnLo = true;
                        this.betOnAlternate = false;
                      }}
                    >
                      LO
                    </Radio>{' '}
                    <Radio
                      name="radioGroupBetOn"
                      inline
                      defaultChecked={this.betOnAlternate}
                      onChange={(e)=>{
                        this.betOnHi = false;
                        this.betOnLo = false;
                        this.betOnAlternate = true;
                      }}
                    >
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
                      <Checkbox
                        defaultChecked={this.stopBettingAfterProfit}
                        onChange={(e)=>{
                          this.stopBettingAfterProfit = e.target.checked;
                        }}
                      >
                        PROFIT >=
                      </Checkbox>
                    </Col>
                    <Col xs={6}>
                      <FormControl
                        type="text"
                        placeholder="PROFIT >="
                        defaultValue={this.stopBettingAfterProfitGreaterEqual}
                        onChange={(e)=>{
                          this.stopBettingAfterProfitGreaterEqual = e.target.value;
                        }}
                      />
                    </Col>
                  </FormGroup>
                  <Clearfix />
                  <FormGroup validationState="success">
                    <Col xs={6}>
                      <Checkbox
                        defaultChecked={this.stopBettingAfterLoss}
                        onChange={(e)=>{
                          this.stopBettingAfterLoss = e.target.checked;
                        }}
                      >
                        LOSS >=
                      </Checkbox>
                    </Col>
                    <Col xs={6}>
                      <FormControl
                        type="text"
                        placeholder="LOSS >="
                        defaultValue={this.stopBettingAfterLossGreaterEqual}
                        onChange={(e)=>{
                          this.stopBettingAfterLossGreaterEqual = e.target.value;
                        }}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md={4} mdPush={4}>
                  <Tabs defaultActiveKey={1} id="on-win-or-lose-tabs">
                    <Tab eventKey={1} title="ON WIN">
                      {this.renderOnWinOrLose(
                        "radioGroupOnWin",
                        this.onWinReturnToBaseBet,
                        (v)=>{this.onWinReturnToBaseBet = v},
                        this.onWinIncreaseBet,
                        (v)=>{this.onWinIncreaseBet = v},
                        this.onWinIncreaseBetBy,
                        (v)=>{this.onWinIncreaseBetBy = v},
                        this.onWinChangeOdds,
                        (v)=>{this.onWinChangeOdds = v},
                        this.onWinChangeOddsTo,
                        (v)=>{this.onWinChangeOddsTo = v},
                      )}
                    </Tab>
                    <Tab eventKey={2} title="ON LOSE">
                      {this.renderOnWinOrLose(
                        "radioGroupOnLose",
                        this.onLoseReturnToBaseBet,
                        (v)=>{this.onLoseReturnToBaseBet = v},
                        this.onLoseIncreaseBet,
                        (v)=>{this.onLoseIncreaseBet = v},
                        this.onLoseIncreaseBetBy,
                        (v)=>{this.onLoseIncreaseBetBy = v},
                        this.onLoseChangeOdds,
                        (v)=>{this.onLoseChangeOdds = v},
                        this.onLoseChangeOddsTo,
                        (v)=>{this.onLoseChangeOddsTo = v},
                      )}
                    </Tab>
                  </Tabs>
                  {console.log(
                    "radioGroupOnWin",
                    this.onWinReturnToBaseBet,
                    this.onWinIncreaseBet,
                    this.onWinIncreaseBetBy,
                    this.onWinChangeOdds,
                    this.onWinChangeOddsTo,
                    "radioGroupOnLose",
                    this.onLoseReturnToBaseBet,
                    this.onLoseIncreaseBet,
                    this.onLoseIncreaseBetBy,
                    this.onLoseChangeOdds,
                    this.onLoseChangeOddsTo,
                  )}
                  <br />
                  <br />
                  <br />
                  <FormGroup validationState="success">
                    <ControlLabel>
                      ON HITTING MAX BET/WIN
                    </ControlLabel>
                    <Checkbox
                      defaultChecked={this.onHittingMaxBetWinReturnToBaseBet}
                      onChange={(e)=>{
                        this.onHittingMaxBetWinReturnToBaseBet = e.target.checked;
                      }}
                    >
                      RETURN TO BASE BET
                    </Checkbox>
                    <Checkbox
                      defaultChecked={this.onHittingMaxBetWinStopBetting}
                      onChange={(e)=>{
                        this.onHittingMaxBetWinStopBetting = e.target.checked;
                      }}
                    >
                      STOP BETTING
                    </Checkbox>
                  </FormGroup>
                  <br />
                  <FormGroup validationState="success">
                    <Checkbox
                      defaultChecked={this.randomizeClientSeed}
                      onChange={(e)=>{
                        this.randomizeClientSeed = e.target.checked;
                      }}
                    >
                      RANDOMIZE CLIENT SEED
                    </Checkbox>
                    <Checkbox
                      disabled
                      defaultChecked={false}
                      onChange={(e)=>{
                      }}
                    >
                      DO NOT REFRESH
                    </Checkbox>
                    <Checkbox
                      disabled
                      defaultChecked={false}
                      onChange={(e)=>{
                      }}
                    >
                      ENABLE SOUNDS
                    </Checkbox>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12} md={4} mdPull={4}>
                  <Well>
                    {this.randomRoll}
                  </Well>
                  {this.props.simulator.noOfRollsRemaining <= 0?
                    <Button
                      bsStyle="warning"
                      onClick={this.onStartAutoBet}
                    >
                      START AUTO-BET
                    </Button>
                  :
                    <Button
                      bsStyle="danger"
                      onClick={this.onStopAutoBet}
                    >
                      STOP AUTO-BET
                    </Button>
                  }
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
                      {this.renderJackpotRow(
                        "1.00000000",
                        "0.00012500",
                        this.prize1Selected,
                        (v)=>{this.prize1Selected = v},
                      )}
                      {this.renderJackpotRow(
                        "0.10000000",
                        "0.00001250",
                        this.prizePoint1Selected,
                        (v)=>{this.prizePoint1Selected = v},
                      )}
                      {this.renderJackpotRow(
                        "0.01000000",
                        "0.00000125",
                        this.prizePoint01Selected,
                        (v)=>{this.prizePoint01Selected = v},
                      )}
                      {this.renderJackpotRow(
                        "0.00100000",
                        "0.00000013",
                        this.prizePoint001Selected,
                        (v)=>{this.prizePoint001Selected = v},
                      )}
                      {this.renderJackpotRow(
                        "0.00010000",
                        "0.00000002",
                        this.prizePoint0001Selected,
                        (v)=>{this.prizePoint0001Selected = v},
                      )}
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
      simulator: state.simulator,
    };
  },
  {
    addResult,
    startAutoBet,
    stopAutoBet,
    startManualBet,
  }
)(Simulator);
