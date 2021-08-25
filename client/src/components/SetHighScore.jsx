import React, { Component } from 'react';
import { Row, Col, Form, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

class SetHighScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      score: props.score,
      date: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    console.log(props)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.showHighScores = props.showHighScores;
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.name.length) {
      await axios.post('http://localhost:3000/highScores', this.state)
      this.props.showHighScores();
    } else {
      alert('You must enter a name to submit a score!')
    }
  }

  handleChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  render() {
    return (
      <Row id="main-hs-row">
        <Alert variant="info" id="submit-score-alert">
          <Alert.Heading id="high-score-submit-heading">Submit Your High Score</Alert.Heading>
          <hr/>
          <span id="chip-total-hs">Highest Chip Total: {this.props.score}</span>
          <br/>
          <Form>
            <Row align="center">
              <Form.Label id="hs-name-label">Enter Your Name:</Form.Label>
            </Row>
            <Row align="center" id="hs-name-row">
              <Form.Control id="hs-name" onChange={this.handleChange} placeholder="Name"/>
            </Row>
            <Button onClick={this.handleSubmit}>Submit</Button>
          </Form>
        </Alert>
      </Row>
    )
  }
}

export default SetHighScore;
