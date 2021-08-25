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
    await axios.post('http://localhost:3000/highScores', this.state)
    this.props.showHighScores();
  }

  handleChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  render() {
    return (
      <Alert variant="info">
        <Alert.Heading id="high-score-submit-heading">Submit Your High Score</Alert.Heading>
        <hr/>
        <span>Highest Chip Total: {this.props.score}</span>
        <br/>
        <Form>
          <Form.Label>Enter Your Name:</Form.Label>
          <Form.Control onChange={this.handleChange}/>
          <Button onClick={this.handleSubmit}>Submit</Button>
        </Form>
      </Alert>
    )
  }
}

export default SetHighScore;
