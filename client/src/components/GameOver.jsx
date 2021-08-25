import React from 'react';
import { Alert, Row, Col, Button } from 'react-bootstrap';

const GameOver = (props) => {
  return (
    <Row align="center">
      <Col md={{span: 8, offset: 2}}>
        <Alert className="outcome-alert" variant="dark">
          <Alert.Heading className="outcome-heading">Game Over! You Don't Have Enough Chips To Play!</Alert.Heading>
          <hr/>
          <span className="outcome-total">Player Total: {props.playerScore}</span>
          <br/>
          <span className="outcome-total">Dealer Total: {props.dealerScore}</span>
          <br/>
          <span className="outcome-total">Highest Chip Total: {props.highScore}</span>
          <div className="play-again">
            <Button onClick={props.playAgain} variant="outline-dark">
              Play Again
            </Button>
          </div>
        </Alert>
      </Col>
    </Row>
  )
}

export default GameOver;