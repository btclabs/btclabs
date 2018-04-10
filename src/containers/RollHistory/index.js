import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';

class RollHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageOfItems: [],
      offset: 0,
    };
    this.perPage = 30;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.setStateForPage(nextProps.results);
    }
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.perPage);

    this.setState({
      offset: offset
    }, ()=>{this.setStateForPage(this.props.results)});
  };

  setStateForPage = (results) => {
    this.setState({
      pageCount: Math.ceil(results.length / this.perPage),
      pageOfItems: results.slice().reverse().slice(this.state.offset, this.state.offset+this.perPage), //The first slice() is for making a copy of the array.
    });
  }

  renderRow = (result, index) => {
    return (
      <tr key={'row' + index}>
        <td>
          {result.time.toLocaleTimeString()}
        </td>
        <td>
          {result.game}
        </td>
        <td>
          {result.bettingOn}
        </td>
        <td>
          {result.randomRoll}
        </td>
        <td>
          {result.betInThisRoll.toFixed(8)}
        </td>
        <td>
          {result.betOddsInThisRoll.toFixed(2)}
        </td>
        <td
          style={{color: result.profitOrLoss >= 0? 'green' : 'red'}}
        >
          {result.profitOrLoss.toFixed(8)}
        </td>
        <td>
          {result.jackpotSelected? '✔' : '✖'}
        </td>
        <td>
          {result.originalBalanceInThisRoll.toFixed(8)}
        </td>
        <td>
          {result.balance.toFixed(8)}
        </td>
      </tr>
    )
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h3>
                ROLL HISTORY
              </h3>
              {this.state.pageOfItems.length > 0?
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={<a href="">...</a>}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              :
                null
              }
              <Table
                striped
                bordered
                condensed
                hover
              >
                <thead>
                  <tr>
                    <th>TIME</th>
                    <th>GAME</th>
                    <th>BET</th>
                    <th>ROLL</th>
                    <th>STAKE</th>
                    <th>MULT</th>
                    <th>PROFIT</th>
                    <th>JPOT</th>
                    <th>BALANCE BEFORE</th>
                    <th>BALANCE AFTER</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pageOfItems.map(this.renderRow)}
                </tbody>
              </Table>
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
      results: state.simulator.results,
    };
  },
  {
  }
)(RollHistory);
