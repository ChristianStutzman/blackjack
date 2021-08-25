import React, { Component } from 'react';
import { Row, Col, Image } from 'react-bootstrap';

class Dealer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    if (this.props.draw) {
      return (
        <Row align="center" className="card-draw-row">
          {this.props.draw.map(card => {
            return (
              <Col key={card.image} className="card-draw-col">
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

export default Dealer;