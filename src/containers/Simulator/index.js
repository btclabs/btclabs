import React, { Component } from 'react';
import { connect } from 'react-redux';
import seedrandom from 'seedrandom';
import { addResult, startAutoBet, stopAutoBet, startManualBet } from '../../actions'
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
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
import Popover from 'react-bootstrap/lib/Popover';

class Simulator extends Component {
  constructor(props) {
    super(props);
    this.maxRandom = 10000;
    this.getRandomSeed = seedrandom();
    this.houseEdge = 0.05;
    this.showAutoBetStatus = false;
    this.showManualBetStatus = false;

    // On screen info - Start
    this.balance = 1.00000000;

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

    this.maxSpeedEnabled = false;
    // On screen info - End

    // For validation - Start
    this.balanceLowerLimit = 0;
    this.betUpperLimit = 20;
    this.betLowerLimit = 0.00000001;
    this.betOddsUpperLimit = 4750.00;
    this.betOddsLowerLimit = 1.01;
    this.noOfRollsLowerLimit = 1;
    this.stopBettingAfterLowerLimit = 0.00000001;
    this.increaseBetByLowerLimit = 0;
    // For validation - End

    this.state = {
      //For display purpose - Start
      winningConditionForHi: 0,
      winningConditionForLo: 0,
      winChance: this.getWinChance(this.betOdds),
      //For display purpose - End
      //For validation - Start
      balanceValidationState: true,
      baseBetValidationState: true,
      maxBetWinValidationState: true,
      betOddsValidationState: true,
      noOfRollsValidationState: true,
      stopBettingAfterProfitGreaterEqualValidationState: true,
      stopBettingAfterLossGreaterEqualValidationState: true,
      onWinIncreaseBetByValidationState: true,
      onLoseIncreaseBetByValidationState: true,
      onWinChangeOddsToValidationState: true,
      onLoseChangeOddsToValidationState: true,
      //For validation - End
    };

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.noOfRollsRemaining !== this.props.noOfRollsRemaining && nextProps.noOfRollsRemaining > 0) {
      let delay;
      if (this.maxSpeedEnabled) {
        delay = 0;
      } else {
        delay = 250;
      }
      this.timeoutId = setTimeout(this.handleRoll, delay);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleSelectManualOrAutoBet = (key) => {
    if (key === "manualBet") {
      return; //placeholder
    }
    if (key === "autoBet") {
      return; //placeholder
    }
  }

  handleStartAutoBet = () => {
    this.showAutoBetStatus = true;
    this.betInThisRoll = this.baseBet;
    this.betInNextRoll = this.baseBet;
    this.betOddsInThisRoll = this.betOdds;
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
    this.jackpotSelected = false;
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
    if (
      !this.state.balanceValidationState ||
      !this.state.balanceValidationState ||
      !this.state.baseBetValidationState ||
      !this.state.maxBetWinValidationState ||
      !this.state.betOddsValidationState ||
      !this.state.noOfRollsValidationState ||
      !this.state.stopBettingAfterProfitGreaterEqualValidationState ||
      !this.state.stopBettingAfterLossGreaterEqualValidationState ||
      !this.state.onWinIncreaseBetByValidationState ||
      !this.state.onLoseIncreaseBetByValidationState ||
      !this.state.onWinChangeOddsToValidationState ||
      !this.state.onLoseChangeOddsToValidationState
    ) {
      this.alertMessage = 'Please check your inputs.';
      this.alertStyle = 'danger';
      this.handleStopAutoBet();
      return;
    }

    this.betInThisRoll = this.betInNextRoll;
    this.betOddsInThisRoll = this.betOddsInNextRoll;
    this.originalBalanceInThisRoll = this.balance;

    if ((
      this.balance
      - this.betInThisRoll
      - (this.jackpot1Selected * this.jackpot1Cost)
      - (this.jackpot2Selected * this.jackpot2Cost)
      - (this.jackpot3Selected * this.jackpot3Cost)
      - (this.jackpot4Selected * this.jackpot4Cost)
      - (this.jackpot5Selected * this.jackpot5Cost)
    ) < 0) {
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
      ((this.bettingOn === 'HI') && (this.randomRoll > this.getWinningConditionForHi(this.betOddsInThisRoll))) ||
      ((this.bettingOn === 'LO') && (this.randomRoll < this.getWinningConditionForLo(this.betOddsInThisRoll)))
    ) {
      //Win
      this.winProfitInThisRoll = this.getWinProfit(this.betInThisRoll, this.betOddsInThisRoll);
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

    this.bettingProfitOrLossInThisSession = Math.round((this.balance - this.originalBalanceInThisSession) * 100000000) / 100000000;
    if (this.bettingProfitOrLossInThisSession >= 0) {
      this.bettingProfitOrLossInThisSessionStyle = 'success';
    } else {
      this.bettingProfitOrLossInThisSessionStyle = 'danger';
    }

    this.rollsPlayedInThisSession += 1;

    //this.rollsRemainingInThisSession is not exactly the same as this.props.noOfRollsRemaining, because this.rollsRemainingInThisSession is for display purpose, it is positive even if the auto bet is stopped.
    this.rollsRemainingInThisSession = this.noOfRolls - this.rollsPlayedInThisSession;

    this.props.addResult({
      time: new Date(),
      game: 'DICE',
      bettingOn: this.bettingOn,
      randomRoll: this.randomRoll,
      betInThisRoll: this.betInThisRoll,
      betOddsInThisRoll: this.betOddsInThisRoll,
      profitOrLoss: this.balance - this.originalBalanceInThisRoll,
      jackpotSelected: this.jackpotSelected,
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

  renderPopover = (message) => {
    return (
      <Popover id={message + Date.now()}>
        {message}
      </Popover>
    );
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
    setChangeOddsTo,
    increaseBetByValidationState,
    setIncreaseBetByValidationState,
    changeOddsToValidationState,
    setChangeOddsToValidationState,
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
        <FormGroup validationState={increaseBetByValidationState? "success" : "error"}>
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
                  (parseFloat(e.target.value) >= this.increaseBetByLowerLimit)? //Use the target value instead of the variable because it is more updated.
                    setIncreaseBetByValidationState(true)
                  :
                    setIncreaseBetByValidationState(false)
                }}
              />
              <InputGroup.Addon>
                %
              </InputGroup.Addon>
            </InputGroup>
            {!increaseBetByValidationState?
              <HelpBlock>
                {'Enter a value greater than or equal to ' + this.increaseBetByLowerLimit}
              </HelpBlock>
            :
              null
            }
          </Col>
        </FormGroup>
        <Clearfix />
        <FormGroup validationState={changeOddsToValidationState? "success" : "error"}>
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
              defaultValue={changeOddsTo.toFixed(0)}
              onChange={(e)=>{
                setChangeOddsTo(parseFloat(e.target.value));
                (parseFloat(e.target.value) >= this.betOddsLowerLimit && parseFloat(e.target.value) <= this.betOddsUpperLimit)? //Use the target value instead of the variable because it is more updated.
                  setChangeOddsToValidationState(true)
                :
                  setChangeOddsToValidationState(false)
              }}
            />
            {!changeOddsToValidationState?
              <HelpBlock>
                {'Enter a value between ' + this.betOddsLowerLimit.toFixed(2) + ' and ' + this.betOddsUpperLimit.toFixed(2)}
              </HelpBlock>
            :
              null
            }
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
          <Row>
            <Col xs={0} sm={6} md={8}>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <FormGroup validationState={this.state.balanceValidationState? "success" : "error"}>
                <InputGroup>
                  <InputGroup.Addon>
                    BALANCE
                  </InputGroup.Addon>
                  <FormControl
                    type="text"
                    placeholder="BALANCE"
                    defaultValue={this.balance.toFixed(8)}
                    onChange={(e)=>{
                      this.balance = parseFloat(e.target.value);
                      (this.balance >= this.balanceLowerLimit)?
                        this.setState({balanceValidationState: true})
                      :
                        this.setState({balanceValidationState: false})
                    }}
                    inputRef={ref => { this.balanceInput = ref; }}
                  />
                </InputGroup>
                {!this.state.balanceValidationState?
                  <HelpBlock>
                    {'Enter a value greater than or equal to ' + this.balanceLowerLimit}
                  </HelpBlock>
                :
                  null
                }
              </FormGroup>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey={"autoBet"}
            onSelect={this.handleSelectManualOrAutoBet}
            animation={false}
            id="manual-or-auto-tabs"
          >
            {/*
            <Tab eventKey={"manualBet"} title="MANUAL BET">
              <br />
            </Tab>
            */}
            <Tab eventKey={"autoBet"} title="AUTO BET">
              <br />
              <Row>
                <Col xs={12} sm={6} md={4}>
                  <Panel>
                    <Panel.Body>
                      <FormGroup validationState={this.state.baseBetValidationState? "success" : "error"}>
                        <InputGroup>
                          <InputGroup.Addon>
                            BASE BET
                          </InputGroup.Addon>
                          <FormControl
                            type="text"
                            placeholder="BASE BET"
                            defaultValue={this.baseBet.toFixed(8)}
                            onChange={(e)=>{
                              this.baseBet = parseFloat(e.target.value);
                              (this.baseBet >= this.betLowerLimit && this.baseBet <= this.betUpperLimit)?
                                this.setState({baseBetValidationState: true})
                              :
                                this.setState({baseBetValidationState: false})
                            }}
                          />
                        </InputGroup>
                        {!this.state.baseBetValidationState?
                          <HelpBlock>
                            {'Enter a value between ' + this.betLowerLimit.toFixed(8) + ' and ' + this.betUpperLimit}
                          </HelpBlock>
                        :
                          null
                        }
                      </FormGroup>
                      <FormGroup validationState={this.state.maxBetWinValidationState? "success" : "error"}>
                        <InputGroup>
                          <InputGroup.Addon>
                            MAX BET/WIN
                          </InputGroup.Addon>
                          <FormControl
                            type="text"
                            placeholder="MAX BET/WIN"
                            defaultValue={this.maxBetWin.toFixed(0)}
                            onChange={(e)=>{
                              this.maxBetWin = parseFloat(e.target.value);
                              (this.maxBetWin >= this.betLowerLimit && this.maxBetWin <= this.betUpperLimit)?
                                this.setState({maxBetWinValidationState: true})
                              :
                                this.setState({maxBetWinValidationState: false})
                            }}
                          />
                        </InputGroup>
                        {!this.state.maxBetWinValidationState?
                          <HelpBlock>
                            {'Enter a value between ' + this.betLowerLimit.toFixed(8) + ' and ' + this.betUpperLimit}
                          </HelpBlock>
                        :
                          null
                        }
                      </FormGroup>
                      <Row>
                        <Col xs={6}>
                          <FormGroup validationState={this.state.betOddsValidationState? "success" : "error"}>
                            <Panel bsStyle={this.state.betOddsValidationState? "success" : "danger"}>
                              <Panel.Heading>
                                <Panel.Title>
                                  BET ODDS
                                </Panel.Title>
                              </Panel.Heading>
                              <Panel.Body>
                                <FormControl
                                  type="text"
                                  placeholder="BET ODDS"
                                  defaultValue={this.betOdds.toFixed(2)}
                                  onChange={(e)=>{
                                    this.betOdds = parseFloat(e.target.value)? parseFloat(e.target.value) : 0; //This is to prevent unexpected problem when this.betOdds is NaN.
                                    this.setState({
                                      winningConditionForHi: this.getWinningConditionForHi(this.betOdds),
                                      winningConditionForLo: this.getWinningConditionForLo(this.betOdds),
                                      winChance: this.getWinChance(this.betOdds),
                                    });
                                    (this.betOdds >= this.betOddsLowerLimit && this.betOdds <= this.betOddsUpperLimit)?
                                      this.setState({betOddsValidationState: true})
                                    :
                                      this.setState({betOddsValidationState: false})
                                  }}
                                />
                                {!this.state.betOddsValidationState?
                                  <HelpBlock>
                                    {'Enter a value between ' + this.betOddsLowerLimit.toFixed(2) + ' and ' + this.betOddsUpperLimit.toFixed(2)}
                                  </HelpBlock>
                                :
                                  null
                                }
                                {/*
                                <div>
                                  {'WIN CHANCE ' + (this.state.winChance*100).toFixed(2) + '%'}
                                </div>
                                */}
                              </Panel.Body>
                            </Panel>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup validationState={this.state.noOfRollsValidationState? "success" : "error"}>
                            <Panel bsStyle={this.state.noOfRollsValidationState? "success" : "danger"}>
                              <Panel.Heading>
                                <Panel.Title>
                                  NO. OF ROLLS
                                </Panel.Title>
                              </Panel.Heading>
                              <Panel.Body>
                                <FormControl
                                  type="text"
                                  placeholder="NO. OF ROLLS"
                                  defaultValue={this.noOfRolls.toFixed(0)}
                                  onChange={(e)=>{
                                    this.noOfRolls = parseInt(e.target.value, 10);
                                    (this.noOfRolls >= this.noOfRollsLowerLimit)?
                                      this.setState({noOfRollsValidationState: true})
                                    :
                                      this.setState({noOfRollsValidationState: false})
                                    }}
                                />
                                {!this.state.noOfRollsValidationState?
                                  <HelpBlock>
                                    {'Enter a value greater than or equal to ' + this.noOfRollsLowerLimit}
                                  </HelpBlock>
                                :
                                  null
                                }
                              </Panel.Body>
                            </Panel>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Panel bsStyle="success">
                        <Panel.Heading>
                          <Panel.Title>
                            BET ON
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                          <FormGroup validationState="success">
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
                        </Panel.Body>
                      </Panel>
                      <Panel
                        bsStyle={(this.state.stopBettingAfterProfitGreaterEqualValidationState && this.state.stopBettingAfterLossGreaterEqualValidationState)?
                          "success"
                        :
                          "danger"
                        }
                      >
                        <Panel.Heading>
                          <Panel.Title>
                            STOP BETTING AFTER
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                          <FormGroup validationState={this.state.stopBettingAfterProfitGreaterEqualValidationState? "success" : "error"}>
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
                                  (this.stopBettingAfterProfitGreaterEqual >= this.stopBettingAfterLowerLimit)?
                                    this.setState({stopBettingAfterProfitGreaterEqualValidationState: true})
                                  :
                                    this.setState({stopBettingAfterProfitGreaterEqualValidationState: false})
                                }}
                              />
                              {!this.state.stopBettingAfterProfitGreaterEqualValidationState?
                                <HelpBlock>
                                  {'Enter a value greater than or equal to ' + this.stopBettingAfterLowerLimit.toFixed(8)}
                                </HelpBlock>
                              :
                                null
                              }
                            </Col>
                          </FormGroup>
                          <Clearfix />
                          <FormGroup validationState={this.state.stopBettingAfterLossGreaterEqualValidationState? "success" : "error"}>
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
                                  (this.stopBettingAfterLossGreaterEqual >= this.stopBettingAfterLowerLimit)?
                                    this.setState({stopBettingAfterLossGreaterEqualValidationState: true})
                                  :
                                    this.setState({stopBettingAfterLossGreaterEqualValidationState: false})
                                }}
                              />
                              {!this.state.stopBettingAfterLossGreaterEqualValidationState?
                                <HelpBlock>
                                  {'Enter a value greater than or equal to ' + this.stopBettingAfterLowerLimit.toFixed(8)}
                                </HelpBlock>
                              :
                                null
                              }
                            </Col>
                          </FormGroup>
                          <Clearfix />
                        </Panel.Body>
                      </Panel>
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col xs={12} sm={6} md={4} mdPush={4}>
                  <Panel>
                    <Panel.Body>
                      <Panel bsStyle="success">
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
                                this.state.onWinIncreaseBetByValidationState,
                                (v)=>{this.setState({onWinIncreaseBetByValidationState: v})},
                                this.state.onWinChangeOddsToValidationState,
                                (v)=>{this.setState({onWinChangeOddsToValidationState: v})},
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
                                this.state.onLoseIncreaseBetByValidationState,
                                (v)=>{this.setState({onLoseIncreaseBetByValidationState: v})},
                                this.state.onLoseChangeOddsToValidationState,
                                (v)=>{this.setState({onLoseChangeOddsToValidationState: v})},
                              )}
                            </Tab>
                          </Tabs>
                        </Panel.Body>
                      </Panel>
                      <Panel bsStyle="success">
                        <Panel.Heading>
                          <Panel.Title>
                            ON HITTING MAX BET/WIN
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                          <FormGroup validationState="success">
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
                        </Panel.Body>
                      </Panel>
                      <Panel bsStyle="success">
                        <Panel.Heading>
                          <Panel.Title>
                            ON HITTING MAX BET/WIN
                          </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
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
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col xs={12} sm={12} md={4} mdPull={4}>
                  <Panel>
                    <Panel.Body
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      <Well
                        style={{fontSize: '400%'}}
                      >
                        {this.randomRoll.toString().padStart(5, '0')}
                      </Well>
                      {this.showAutoBetStatus?
                        <Alert
                          bsStyle={this.alertStyle}
                        >
                          <b>
                            {this.alertMessage}
                          </b>
                        </Alert>
                      :
                        null
                      }
                      {this.jackpotSelected?
                        <Alert
                          bsStyle={this.jackpotAlertStyle}
                        >
                          <b>
                            {this.jackpotAlertMessage}
                          </b>
                        </Alert>
                      :
                        null
                      }
                      {this.props.noOfRollsRemaining <= 0?
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
                      <Checkbox
                        defaultChecked={this.maxSpeedEnabled}
                        onChange={(e)=>{
                          this.maxSpeedEnabled = e.target.checked;
                        }}
                      >
                        MAX SPEED
                      </Checkbox>
                      {this.showAutoBetStatus?
                        <div>
                          <div>
                            <small>
                              ROLLS PLAYED:
                            </small>
                          </div>
                          <div>
                            <b>
                              {this.rollsPlayedInThisSession}
                            </b>
                          </div>
                          <div>
                            <small>
                              ROLLS REMAINING:
                            </small>
                          </div>
                          <div>
                            <b>
                              {this.rollsRemainingInThisSession}
                            </b>
                          </div>
                          <div>
                            <small>
                              BIGGEST BET THIS SESSION:
                            </small>
                          </div>
                          <div>
                            <b>
                              {this.biggestBetInThisSession.toFixed(8) + ' BTC'}
                            </b>
                          </div>
                          <div>
                            <small>
                              BIGGEST WIN THIS SESSION:
                            </small>
                          </div>
                          <div>
                            <b>
                              {this.biggestWinInThisSession.toFixed(8) + ' BTC'}
                            </b>
                          </div>
                          <div>
                            <small>
                              BETTING P/L THIS SESSION:
                            </small>
                          </div>
                          <Alert
                            bsStyle={this.bettingProfitOrLossInThisSessionStyle}
                          >
                            <b>
                              {this.bettingProfitOrLossInThisSession.toFixed(8) + ' BTC'}
                            </b>
                          </Alert>
                        </div>
                      :
                        null
                      }
                      <div>
                        {'To win, BET HI and get a number higher than '}
                        <b>{this.getWinningConditionForHi(this.betOdds)}</b>
                        {' or BET LO and get a number lower than '}
                        <b>{this.getWinningConditionForLo(this.betOdds)}</b>
                      </div>
                      <div>
                        <b>PLAY FOR JACKPOTS</b>
                      </div>
                      <div>
                        Roll number <b>8888</b> to win the jackpots!
                      </div>
                      <Table
                        striped
                        bordered
                        condensed
                      >
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
      noOfRollsRemaining: state.simulator.noOfRollsRemaining,
    };
  },
  {
    addResult,
    startAutoBet,
    stopAutoBet,
    startManualBet,
  }
)(Simulator);
