import React, { Component } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

class Ante extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pot: 0
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    let pot = this.state.pot;
    pot += Number(event.target.getAttribute('value'));
    this.setState({pot: pot});
  }

  handleReset(event) {
    event.preventDefault();
    this.setState({pot: 0});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.pot >= 5) {
      this.props.submitBet(this.state.pot);
    } else {
      alert('Opening bet must be at least $5!');
    }
  }

  render() {
    return (
      <React.Fragment>
        <Row align="center">
          <h1>Place Your Bets!</h1>
        </Row>
        <Row id="betting-pot">
          <span>Total Bet: {this.state.pot}</span>
        </Row>
        <Row id="chip-row" align="center">
          <Col>
            <Image className="chip-1" value="1" onClick={this.handleClick} src="https://purepng.com/public/uploads/large/purepng.com-poker-chipspokercard-gamescombines-gamblingstrategyskillsportgamepoker-chips-17015281809543xfra.png" />
          </Col>
          <Col>
            <Image className="chip" value="20" onClick={this.handleClick} src="https://purepng.com/public/uploads/large/purepng.com-poker-chipspokercard-gamescombines-gamblingstrategyskillsportgamepoker-chips-1701528180769y7bf5.png" />
          </Col>
          <Col>
            <Image className="chip" value="50" onClick={this.handleClick} src="https://purepng.com/public/uploads/large/purepng.com-poker-chipspokercard-gamescombines-gamblingstrategyskillsportgamepoker-chips-1701528180729donla.png" />
          </Col>
          <Col>
            <Image className="chip" value="100" onClick={this.handleClick} src="https://purepng.com/public/uploads/large/purepng.com-poker-chipspokercard-gamescombines-gamblingstrategyskillsportgamepoker-chips-1701528180743xy4rw.png" />
          </Col>
        </Row>
        <Row align="left">
          <span className="player-chips">Chips Available: {this.props.chips}</span>
        </Row>
        <Row id="ante-btn-row">
          <Col md={{span: 3, offset: 2}}>
            <Button variant="success" onClick={this.handleReset}>Reset Bet</Button>
          </Col>
          <Col md={{span: 3, offset: 2}}>
            <Button variant="success" onClick={this.handleSubmit}>Submit Bet</Button>
          </Col>
        </Row>
      </React.Fragment>
    )

  }
}

export default Ante;