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
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import Alert from 'react-bootstrap/lib/Alert';

class Simulator extends Component {
  constructor(props) {
    super(props);
    this.maxRandom = 10000;
    this.getRandomSeed = seedrandom();
    this.houseEdge = 0.05;
    this.showAutoBetStatus = false;
    this.showManualBetStatus = false;

    // On screen info - Start
    this.balance = 0.00100000;

    this.baseBet = 0.00000001;
    this.maxBetWin = 20;
    this.betOdds = 2.00;
    this.noOfRolls = 10;
    this.betOnHi = false;
    this.betOnLo = false;
    this.betOnAlternate = true;
    this.stopBettingAfterProfit = false;
    this.stopBettingAfterProfitGreaterEqual = 0.00000001;
    this.stopBettingAfterLoss = false;
    this.stopBettingAfterLossGreaterEqual = 0.00000001;

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

    this.jackpot1Selected = false;
    this.jackpot2Selected = false;
    this.jackpot3Selected = false;
    this.jackpot4Selected = false;
    this.jackpot5Selected = false;

    this.jackpot1Prize = 1.00000000;
    this.jackpot2Prize = 0.10000000;
    this.jackpot3Prize = 0.01000000;
    this.jackpot4Prize = 0.00100000;
    this.jackpot5Prize = 0.00010000;

    this.jackpot1Cost = 0.00012500;
    this.jackpot2Cost = 0.00001250;
    this.jackpot3Cost = 0.00000125;
    this.jackpot4Cost = 0.00000013;
    this.jackpot5Cost = 0.00000002;
    // On screen info - End


  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulator.noOfRollsRemaining !== this.props.simulator.noOfRollsRemaining && nextProps.simulator.noOfRollsRemaining > 0) {
      this.timeoutId = setTimeout(this.handleRoll, 250);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleSelectManualOrAutoBet = (key) => {
    if (key === "manualBet") {
      console.log('manual bet...');
    }
    if (key === "autoBet") {
      console.log('auto bet...');
    }
  }

  handleStartAutoBet = () => {
    this.showAutoBetStatus = true;
    this.betInThisRoll = this.baseBet;
    this.betInNextRoll = this.baseBet;
    this.betOddsInNextRoll = this.betOdds;
    this.originalBalanceInThisSession = this.balance;
    this.rollsPlayedInThisSession = 0;
    this.rollsRemainingInThisSession = 0;
    this.biggestBetInThisSession = 0;
    this.biggestWinInThisSession = 0;
    this.bettingProfitOrLossInThisSession = 0;
    this.bettingProfitOrLossInThisSessionStyle = 'info';
    this.alertMessage = '';
    this.alertStyle = 'info';
    this.jackpotAlertMessage = '';
    this.jackpotAlertStyle = 'info';
    this.bettingOnForBetOnAlternate = 'LO';

    this.props.startAutoBet(this.noOfRolls);
    this.handleRoll();
  }

  handleStopAutoBet = () => {
    this.props.stopAutoBet();
    clearTimeout(this.timeoutId);
  }

  handleStartManualBet = () => {
    this.showManualBetStatus = true;
    this.props.startManualBet();
  }

  handleRoll = () => {
    this.betInThisRoll = this.betInNextRoll;
    this.betOdds = this.betOddsInNextRoll;
    this.originalBalanceInThisRoll = this.balance;
    if (this.balance - this.betInThisRoll < 0) {
      this.alertMessage = 'Insufficient balance to make this bet';
      this.alertStyle = 'danger';
      this.handleStopAutoBet();
      return;
    }

    if (this.betInThisRoll > this.biggestBetInThisSession) {
      this.biggestBetInThisSession = this.betInThisRoll;
    }

    this.randomizeRoll();

    //Handle win or lose
    if (this.betOnHi) {
      this.bettingOn = 'HI';
    }
    if (this.betOnLo) {
      this.bettingOn = 'LO';
    }
    if (this.betOnAlternate) {
      this.bettingOn = this.bettingOnForBetOnAlternate;
    }

    this.winProfitInThisRoll = 0;

    if (
      ((this.bettingOn === 'HI') && (this.randomRoll > this.getWinningConditionForHi(this.betOdds))) ||
      ((this.bettingOn === 'LO') && (this.randomRoll < this.getWinningConditionForLo(this.betOdds)))
    ) {
      //Win
      this.winProfitInThisRoll = this.getWinProfit(this.betInThisRoll, this.betOdds);
      this.balance = this.balance + this.winProfitInThisRoll;
      this.alertMessage = 'You BET ' + this.bettingOn + ' so you win ' + this.winProfitInThisRoll.toFixed(8) + ' BTC!';
      this.alertStyle = 'success';
      if (this.winProfitInThisRoll > this.biggestWinInThisSession) {
        this.biggestWinInThisSession = this.winProfitInThisRoll;
      }
      if (this.onWinReturnToBaseBet) {
        this.betInNextRoll = this.baseBet;
      }
      if (this.onWinIncreaseBet) {
        //Use toFixed instead of Math.round, so that it rounds similarly to the site.
        this.betInNextRoll = parseFloat((this.betInThisRoll * (1 + (this.onWinIncreaseBetBy / 100))).toFixed(8));
      }
      if (this.onWinChangeOdds) {
        this.betOddsInNextRoll = this.onWinChangeOddsTo;
      }
    } else {
      //Lose
      this.balance = this.balance - this.betInThisRoll;
      this.alertMessage = 'You BET ' + this.bettingOn + ' so you lose ' + this.betInThisRoll.toFixed(8) + ' BTC!';
      this.alertStyle = 'danger';
      if (this.onLoseReturnToBaseBet) {
        this.betInNextRoll = this.baseBet;
      }
      if (this.onLoseIncreaseBet) {
        //Use toFixed instead of Math.round, so that it rounds similarly to the site.
        this.betInNextRoll = parseFloat((this.betInThisRoll * (1 + (this.onLoseIncreaseBetBy / 100))).toFixed(8));
      }
      if (this.onLoseChangeOdds) {
        this.betOddsInNextRoll = this.onLoseChangeOddsTo;
      }
    }


    //Handle jackpot
    this.jackpotWonInThisRoll = 0;

    this.jackpotWon = false;
    this.jackpotSelected = (
      this.jackpot1Selected ||
      this.jackpot2Selected ||
      this.jackpot3Selected ||
      this.jackpot4Selected ||
      this.jackpot5Selected
    );

    if (this.jackpotSelected) {
      if (this.randomRoll === 8888) {
        this.jackpotWon = true;
        if (this.jackpot1Selected) {
          this.balance = this.balance - this.jackpot1Cost + this.jackpot1Prize;
          this.jackpotWonInThisRoll = this.jackpotWonInThisRoll + this.jackpot1Prize;
        }
        if (this.jackpot2Selected) {
          this.balance = this.balance - this.jackpot2Cost + this.jackpot2Prize;
          this.jackpotWonInThisRoll = this.jackpotWonInThisRoll + this.jackpot2Prize;
        }
        if (this.jackpot3Selected) {
          this.balance = this.balance - this.jackpot3Cost + this.jackpot3Prize;
          this.jackpotWonInThisRoll = this.jackpotWonInThisRoll + this.jackpot3Prize;
        }
        if (this.jackpot4Selected) {
          this.balance = this.balance - this.jackpot4Cost + this.jackpot4Prize;
          this.jackpotWonInThisRoll = this.jackpotWonInThisRoll + this.jackpot4Prize;
        }
        if (this.jackpot5Selected) {
          this.balance = this.balance - this.jackpot5Cost + this.jackpot5Prize;
          this.jackpotWonInThisRoll = this.jackpotWonInThisRoll + this.jackpot5Prize;
        }
        this.jackpotAlertMessage = 'Congratulations! You have won the jackpot of ' + this.jackpotWonInThisRoll.toFixed(8) + ' BTC';
        this.jackpotAlertStyle = 'success';
      } else {
        this.jackpotWon = false;
        if (this.jackpot1Selected) {
          this.balance = this.balance - this.jackpot1Cost;
        }
        if (this.jackpot2Selected) {
          this.balance = this.balance - this.jackpot2Cost;
        }
        if (this.jackpot3Selected) {
          this.balance = this.balance - this.jackpot3Cost;
        }
        if (this.jackpot4Selected) {
          this.balance = this.balance - this.jackpot4Cost;
        }
        if (this.jackpot5Selected) {
          this.balance = this.balance - this.jackpot5Cost;
        }
        this.jackpotAlertMessage = 'Sorry, you did not win the jackpot.';
        this.jackpotAlertStyle = 'warning';
      }
    }

    this.balanceInput.value = this.balance.toFixed(8);

    this.bettingProfitOrLossInThisSession = this.balance - this.originalBalanceInThisSession;
    if (this.bettingProfitOrLossInThisSession >= 0) {
      this.bettingProfitOrLossInThisSessionStyle = 'success';
    } else {
      this.bettingProfitOrLossInThisSessionStyle = 'danger';
    }

    this.rollsPlayedInThisSession += 1;

    //this.rollsRemainingInThisSession is not exactly the same as this.props.simulator.noOfRollsRemaining, because this.rollsRemainingInThisSession is for display purpose, it is positive even if the auto bet is stopped.
    this.rollsRemainingInThisSession = this.noOfRolls - this.rollsPlayedInThisSession;

    this.props.addResult({
      time: new Date(),
      game: 'DICE',
      bettingOn: this.bettingOn,
      randomRoll: this.randomRoll,
      betInThisRoll: this.betInThisRoll,
      betOdds: this.betOdds,
      profitOrLoss: this.balance - this.originalBalanceInThisRoll,
      jackpotWon: this.jackpotWon,
      originalBalanceInThisRoll: this.originalBalanceInThisRoll,
      balance: this.balance,
    });


    if (this.betOnAlternate) {
      if (this.bettingOnForBetOnAlternate === 'LO') {
        this.bettingOnForBetOnAlternate = 'HI';
      } else {
        this.bettingOnForBetOnAlternate = 'LO';
      }
    }

    if (this.betInNextRoll > this.maxBetWin) {
      this.betInNextRoll = this.maxBetWin;
    }

    //The condition is met if the bet for next roll is greater than the max or if the win profit of this roll is greater than the max.
    if (this.betInNextRoll >= this.maxBetWin || this.winProfitInThisRoll >= this.maxBetWin) {
      if (this.onHittingMaxBetWinReturnToBaseBet) {
        this.betInNextRoll = this.baseBet;
      }
      if (this.onHittingMaxBetWinStopBetting) {
        this.handleStopAutoBet();
        return;
      }
    }

    if (this.stopBettingAfterProfit && this.bettingProfitOrLossInThisSession >= this.stopBettingAfterProfitGreaterEqual) {
      this.handleStopAutoBet();
      return;
    }

    if (this.stopBettingAfterLoss && this.bettingProfitOrLossInThisSession <= (-1 * this.stopBettingAfterLossGreaterEqual)) {
      this.handleStopAutoBet();
      return;
    }

  }

  getWinChance = (betOdds) => {
    return (1/betOdds)*(1-this.houseEdge);
  }

  getWinningConditionForHi = (betOdds) => {
    return Math.round((1-this.getWinChance(betOdds)) * this.maxRandom); //Higher than this to win
  }

  getWinningConditionForLo = (betOdds) => {
    return Math.round(this.getWinChance(betOdds) * this.maxRandom); //Lower than this to win
  }

  getWinProfit = (bet, betOdds) => {
    let winProfit = Math.floor(bet * (betOdds - 1) * 100000000) / 100000000;
    if (winProfit > this.maxBetWin) {
      winProfit = this.maxBetWin;
    }
    return winProfit;
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
                defaultValue={increaseBetBy.toFixed(2)}
                onChange={(e)=>{
                  setIncreaseBetBy(parseFloat(e.target.value));
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
                setChangeOddsTo(parseFloat(e.target.value));
              }}
            />
          </Col>
        </FormGroup>
      </div>
    )
  }

  renderJackpotRow = (prize, cost, jackpotSelected, setJackpotSelected) => {
    return (
      <tr>
        <td>
          <Checkbox
            defaultChecked={jackpotSelected}
            onChange={(e)=>{
              setJackpotSelected(e.target.checked);
            }}
          >
          </Checkbox>
        </td>
        <td>{prize.toFixed(8)}</td>
        <td>{cost.toFixed(8)}</td>
      </tr>
    )
  }

  render() {
    return (
      <div>
        <form>
          <FormGroup validationState="success">
            <Col xs={5}>
              <ControlLabel>
                BALANCE
              </ControlLabel>
            </Col>
            <Col xs={7}>
              <FormControl
                type="text"
                placeholder="BALANCE"
                defaultValue={this.balance.toFixed(8)}
                onChange={(e)=>{this.balance = parseFloat(e.target.value)}}
                inputRef={ref => { this.balanceInput = ref; }}
              />
            </Col>
          </FormGroup>
          <Tabs
            defaultActiveKey={"manualBet"}
            onSelect={this.handleSelectManualOrAutoBet}
            animation={false}
            id="manual-or-auto-tabs"
          >
            <Tab eventKey={"manualBet"} title="MANUAL BET">
              <br />
            </Tab>
            <Tab eventKey={"autoBet"} title="AUTO BET">
              <br />
              <Row>
                <Col xs={12} sm={6} md={4}>
                  <Panel>
                    <Panel.Body>
                      <FormGroup validationState="success">
                        <InputGroup>
                          <InputGroup.Addon>
                            BASE BET
                          </InputGroup.Addon>
                          <FormControl
                            type="text"
                            placeholder="BASE BET"
                            defaultValue={this.baseBet.toFixed(8)}
                            onChange={(e)=>{this.baseBet = parseFloat(e.target.value)}}
                          />
                        </InputGroup>
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
                            onChange={(e)=>{this.maxBetWin = parseFloat(e.target.value)}}
                          />
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
                              defaultValue={this.betOdds.toFixed(2)}
                              onChange={(e)=>{
                                this.betOdds = parseFloat(e.target.value);
                              }}
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
                              onChange={(e)=>{this.noOfRolls = parseInt(e.target.value, 10)}}
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
                            defaultValue={this.stopBettingAfterProfitGreaterEqual.toFixed(8)}
                            onChange={(e)=>{
                              this.stopBettingAfterProfitGreaterEqual = parseFloat(e.target.value);
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
                            defaultValue={this.stopBettingAfterLossGreaterEqual.toFixed(8)}
                            onChange={(e)=>{
                              this.stopBettingAfterLossGreaterEqual = parseFloat(e.target.value);
                            }}
                          />
                        </Col>
                      </FormGroup>
                      <Clearfix />
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col xs={12} sm={6} md={4} mdPush={4}>
                  <Panel>
                    <Panel.Body>
                      <Tabs
                        defaultActiveKey={"onWin"}
                        animation={true}
                        id="on-win-or-lose-tabs"
                      >
                        <Tab eventKey={"onWin"} title="ON WIN">
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
                        <Tab eventKey={"onLose"} title="ON LOSE">
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
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col xs={12} sm={12} md={4} mdPull={4}>
                  <Panel>
                    <Panel.Body>
                      <Well>
                        {this.randomRoll.toString().padStart(5, '0')}
                      </Well>
                      {this.showAutoBetStatus?
                        <Alert
                          bsStyle={this.alertStyle}
                        >
                          {this.alertMessage}
                        </Alert>
                      :
                        null
                      }
                      {this.jackpotSelected?
                        <Alert
                          bsStyle={this.jackpotAlertStyle}
                        >
                          {this.jackpotAlertMessage}
                        </Alert>
                      :
                        null
                      }
                      {this.props.simulator.noOfRollsRemaining <= 0?
                        <Button
                          bsStyle="warning"
                          onClick={this.handleStartAutoBet}
                        >
                          START AUTO-BET
                        </Button>
                      :
                        <Button
                          bsStyle="danger"
                          onClick={this.handleStopAutoBet}
                        >
                          STOP AUTO-BET
                        </Button>
                      }
                      {this.showAutoBetStatus?
                        <div>
                          <div>
                            ROLLS PLAYED:
                          </div>
                          <div>
                            {this.rollsPlayedInThisSession}
                          </div>
                          <div>
                            ROLLS REMAINING:
                          </div>
                          <div>
                            {this.rollsRemainingInThisSession}
                          </div>
                          <div>
                            BIGGEST BET THIS SESSION:
                          </div>
                          <div>
                            {this.biggestBetInThisSession.toFixed(8) + ' BTC'}
                          </div>
                          <div>
                            BIGGEST WIN THIS SESSION:
                          </div>
                          <div>
                            {this.biggestWinInThisSession.toFixed(8) + ' BTC'}
                          </div>
                          <div>
                            BETTING P/L THIS SESSION:
                          </div>
                          <Alert
                            bsStyle={this.bettingProfitOrLossInThisSessionStyle}
                          >
                            {this.bettingProfitOrLossInThisSession.toFixed(8) + ' BTC'}
                          </Alert>
                        </div>
                      :
                        null
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
                            this.jackpot1Prize,
                            this.jackpot1Cost,
                            this.jackpot1Selected,
                            (v)=>{this.jackpot1Selected = v},
                          )}
                          {this.renderJackpotRow(
                            this.jackpot2Prize,
                            this.jackpot2Cost,
                            this.jackpot2Selected,
                            (v)=>{this.jackpot2Selected = v},
                          )}
                          {this.renderJackpotRow(
                            this.jackpot3Prize,
                            this.jackpot3Cost,
                            this.jackpot3Selected,
                            (v)=>{this.jackpot3Selected = v},
                          )}
                          {this.renderJackpotRow(
                            this.jackpot4Prize,
                            this.jackpot4Cost,
                            this.jackpot4Selected,
                            (v)=>{this.jackpot4Selected = v},
                          )}
                          {this.renderJackpotRow(
                            this.jackpot5Prize,
                            this.jackpot5Cost,
                            this.jackpot5Selected,
                            (v)=>{this.jackpot5Selected = v},
                          )}
                        </tbody>
                      </Table>
                    </Panel.Body>
                  </Panel>
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
