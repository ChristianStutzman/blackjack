import React from 'react';
import { Alert, Row, Col, Button } from 'react-bootstrap';

const Draw = (props) => {
  return (
    <Row align="center">
      <Col md={{span: 8, offset: 2}}>
        <Alert className="outcome-alert" variant="warning">
          <Alert.Heading className="outcome-heading">Draw!</Alert.Heading>
          <hr/>
          <span className="outcome-total">Player Total: {props.playerScore}</span>
          <br/>
          <span className="outcome-total">Dealer Total: {props.dealerScore}</span>
          <br/>
          <span className="outcome-total">Total Chips Left: {props.chips}</span>
          <div className="play-again">
            <Button onClick={props.playAgain} variant="outline-warning">
              Play Again
            </Button>
          </div>
        </Alert>
      </Col>
    </Row>
  )
}

export default Draw;