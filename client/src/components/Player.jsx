import React, { Component } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

class Player extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    console.log(this.props);
    if (this.props.draw) {
      return (
        <React.Fragment>
          <Row className="card-draw-row">
            {this.props.draw.map(card => {
              return (
                <Col key={card.image} className="card-draw-col">
                  <Image className="card-image" src={card.image} />
                </Col>
              )
            })}
          </Row>
          <Row className="player-btn-row">
            <Col>
              <Button variant='success' onClick={() => this.props.drawCard('player')}>HIT</Button>
            </Col>
            <Col>
              <Button variant='success' onClick={() => this.props.drawCard('dealer')}>STAND</Button>
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
