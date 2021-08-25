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
          <Row id="game-over-btn-row">
            <Col>
              <Button id="submit-score" onClick={props.submitScore} variant="outline-dark">
                Submit Score To Leaderboard
              </Button>
            </Col>
            <Col>
              <Button onClick={props.playAgain} variant="outline-dark">
                Play Again
              </Button>
            </Col>
          </Row>
        </Alert>
      </Col>
    </Row>
  )
}

export default GameOver;