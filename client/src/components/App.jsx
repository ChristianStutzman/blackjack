import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Dealer from './Dealer.jsx';
import Player from './Player.jsx';




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckId: null,
      playerDraw: null,
      dealerDraw: null,
      dealerScore: 0,
      playerScore: 0
    }

    this.updateScore = this.updateScore.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.triggerGameOver = this.triggerGameOver.bind(this);
    this.triggerResults = this.triggerResults.bind(this);
  }

  updateScore = (cards, player) => {
    let score = 0;
    let aceStack = 0;
    cards.forEach(card => {
      let cardId = card.code.slice(0, 1);
      let cardValue;
      if (Number(cardId)) {
        if (Number(cardId) === 0) {
          cardValue = 10
        } else {
          cardValue = Number(cardId);
        }
      } else if (cardId !== 'A') {
        cardValue = 10;
      } else {
        aceStack++
        // if ((this.state[`${player}Score`] + 11) > 21) {
        //   cardValue = 1;
        // } else {
        //   cardValue = 11;
        // }
      }
      // let tempState = this.state;
      console.log(cardValue)
      if (cardValue) {
        score += cardValue;
        // tempState[`${player}Score`] = tempState[`${player}Score`] + cardValue;
      }
      // this.setState(tempState);
    })
    console.log('acestack', aceStack)
    if (aceStack > 0) {
      if (aceStack + this.state[`${player}Score`] < 11) {
        aceStack += 10;
      }
      console.log('increased ace', aceStack);
    }
    let tempState = this.state;
    tempState[`${player}Score`] = score + aceStack;
  }

  async drawCard(event) {
    event.preventDefault();

    // Draw player card
    let draw = await axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`);
    let card = draw.data.cards[0];
    let hand = this.state.playerDraw;
    hand.push(card);
    this.setState({
      playerDraw: hand
    })
    this.updateScore(this.state.playerDraw, 'player');

    // Check if player score has reached or exceeded maximum
    if (this.state.playerScore > 21) {
      this.triggerGameOver();
    } else if (this.state.playerScore === 21) {
      this.triggerResults();
    }

    // Draw dealer card if applicable
    if (this.state.dealerScore < 17) {
      let dealerDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`);
      let dealerCard = dealerDraw.data.cards[0];
      let dealerHand = this.state.dealerDraw;
      dealerHand.push(dealerCard);
      this.setState({
        dealerDraw: dealerHand
      })
      this.updateScore(this.state.dealerDraw, 'dealer');

      // Check if dealer score has reached or exceeded maximum
      if (this.state.dealerScore > 21) {
        this.triggerGameOver();
      } else if (this.state.dealerScore === 21) {
        this.triggerResults();
      }
    }
  }

  triggerGameOver() {
    console.log('GAME OVER')
  }

  triggerResults() {
    console.log('results')
  }

  async componentDidMount () {
    const deck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    const initialDeckDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.data.deck_id}/draw/?count=4`);
    let playerDraw = initialDeckDraw.data.cards.slice(0, 2);
    let dealerDraw = initialDeckDraw.data.cards.slice(2);
    this.setState({
      deckId: deck.data.deck_id,
      playerDraw: playerDraw,
      dealerDraw: dealerDraw
    })
    this.updateScore(playerDraw, 'player');
    this.updateScore(dealerDraw, 'dealer');
  }

  render() {
    return (
      <Container>
        <Row id="main-header">
          <h1>BlackJack</h1>
        </Row>
        <Row id="main-dealer-row">
          <Dealer draw={this.state.dealerDraw} drawCard={this.drawCard}/>
        </Row>
        <Row id="main-player-row">
          <Player draw={this.state.playerDraw} drawCard={this.drawCard}/>
        </Row>
      </Container>
    )
  }
}

export default App;