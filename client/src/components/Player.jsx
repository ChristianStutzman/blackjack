import React, { Component } from 'react';
import { Row, Col, Image } from 'react-bootstrap';

class Player extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    console.log(this.props);
    if (this.props.draw) {
      return (
        <Row className="card-draw-row">
          {this.props.draw.map(card => {
            return (
              <Col className="card-draw-col">
                <Image className="card-image" src={card.image} />
              </Col>
            )
          })}
        </Row>
      )
    } else {
      return <span>Loading...</span>
    }
  }
}

export default Player;
