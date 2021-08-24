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
  }

  updateScore = (cards, player) => {
    cards.forEach(card => {
      let cardId = card.code.slice(0, 1);
      let cardValue;
      if (Number(cardId)) {
        cardValue = Number(cardId);
      } else if (cardId !== 'A') {
        cardValue = 10;
      } else {
        if ((this.state[`${player}Score`] + 11) > 21) {
          cardValue = 1;
        } else {
          cardValue = 11;
        }
      }
      let tempState = this.state;
      tempState[`${player}Score`] = tempState[`${player}Score`] + cardValue;
      this.setState(tempState);
    })
  }

  async componentDidMount () {
    const deck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    const initialDeckDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.data.deck_id}/draw/?count=4`);
    let playerDraw = initialDeckDraw.data.cards.slice(0, 2);
    let dealerDraw = initialDeckDraw.data.cards.slice(2);
    this.setState({
      deckId: deck.deck_id,
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
          <Dealer draw={this.state.dealerDraw}/>
        </Row>
        <Row id="main-player-row">
          <Player draw={this.state.playerDraw}/>
        </Row>
      </Container>
    )
  }
}

export default App;