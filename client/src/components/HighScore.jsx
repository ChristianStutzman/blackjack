import React, { Component } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import axios from 'axios';

class HighScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: null
    }
  }

  async componentDidMount() {
    const scores = await axios.get(`http://${this.props.ip}:3000/highScores`);
    this.setState({
      scores: scores.data
    })
  }

  render() {
    if (this.state.scores) {
      return (
        <Row align="center">
          <Alert variant="info" id="high-score-card">
            <Alert.Heading>High Scores</Alert.Heading>
            <hr/>
            {this.state.scores.map(score => (
              <Row className="high-score-row">
                <Col className="high-score-name high-score-info">
                  <span>{score.name}</span>
                </Col>
                <Col className="high-score-score high-score-info">
                  <span>{score.score}</span>
                </Col>
                <Col className="high-score-date high-score-info">
                  <span>{score.date}</span>
                </Col>
              </Row>
            ))}
            <hr/>
            <Row align="center" id="high-score-btn">
              <Button onClick={this.props.playAgain}>Play Again</Button>
            </Row>
          </Alert>
        </Row>
      )
    } else {
      return (
        <span>Loading...</span>
      )
    }
  }
}

export default HighScore;
