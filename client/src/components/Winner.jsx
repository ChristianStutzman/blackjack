import React from 'react';
import { Alert, Row, Col, Button } from 'react-bootstrap';

const Winner = (props) => {
  return (
    <Row align="center">
      <Col md={{span: 8, offset: 2}}>
        <Alert className="outcome-alert" variant="success">
          <Alert.Heading className="outcome-heading">Congratulations! You Won!</Alert.Heading>
          <hr/>
          <span className="outcome-total">Player Total: {props.playerScore}</span>
          <br/>
          <span className="outcome-total">Dealer Total: {props.dealerScore}</span>
          <div className="play-again">
            <Button variant="outline-success">
              Play Again
            </Button>
          </div>
        </Alert>
      </Col>
    </Row>
  )
}

export default Winner;