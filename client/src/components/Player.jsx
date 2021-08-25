import React, { Component } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

class Player extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    if (this.props.draw) {
      return (
        <React.Fragment>
          <Row align="center" className="card-draw-row">
            {this.props.draw.map(card => {
              return (
                <Col key={card.image} className="card-draw-col">
                  <Image className="card-image" src={card.image} />
                </Col>
              )
            })}
          </Row>
          <Row>
            <Col md={4}>
              <span id="chip-total">Chips: {this.props.chips}</span>
            </Col>
            <Col md={{span: 4, offset: 4}}>
              <span id="player-score">Your score: {this.props.score}</span>
            </Col>
          </Row>
        </React.Fragment>
      )
    } else {
      return <span>Loading...</span>
    }
  }
}

export default Player;
