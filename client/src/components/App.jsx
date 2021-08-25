import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';


import Dealer from './Dealer.jsx';
import Player from './Player.jsx';
import Winner from './Winner.jsx';
import Loser from './Loser.jsx';
import Ante from './Ante.jsx';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckId: null,
      playerDraw: null,
      dealerDraw: null,
      dealerScore: 0,
      playerScore: 0,
      initialDealerCardImage: null,
      winner: false,
      loser: false,
      ante: true,
      playerChips: 500,
      totalPot: 0
    }

    this.updateScore = this.updateScore.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.triggerGameOver = this.triggerGameOver.bind(this);
    this.triggerResults = this.triggerResults.bind(this);
    this.submitBet = this.submitBet.bind(this);
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
    this.setState(tempState);
  }

  async drawCard(player) {
    if (player === 'player') {
      // Draw player card
      let draw = await axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`);
      let card = draw.data.cards[0];
      let hand = this.state.playerDraw;
      hand.push(card);
      this.setState({
        playerDraw: hand
      })
      this.updateScore(this.state.playerDraw, 'player');

      setTimeout(() => {
        // Check if player score has reached or exceeded maximum
        if (this.state.playerScore > 21) {
          this.triggerGameOver();
        } else if (this.state.playerScore === 21) {
          this.triggerResults();
        }
      }, 1000)

    } else if (player === 'dealer') {
      // Show initial dealer draw
      let currentDealerHand = this.state.dealerDraw;
      currentDealerHand[0].image = this.state.initialDealerCardImage;
      this.setState({
        dealerDraw: currentDealerHand
      })

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

        setTimeout(() => {
          if (this.state.dealerScore < 17) {
            this.drawCard('dealer');
          } else {
            this.triggerResults();
          }
        }, 500);
      } else {
        setTimeout(this.triggerResults, 500);
      }
    }
  }

  triggerGameOver() {
    // alert('YOU LOST! GAME OVER');
    setTimeout(() => {
      this.setState({
        loser: true
      })
    }, 750);
  }

  triggerResults() {
    if (this.state.playerScore > this.state.dealerScore || this.state.dealerScore > 21) {
      // alert('YOU WON!')
      setTimeout(() => {
        this.setState({
          winner: true
        })
      }, 750);
    } else {
      this.triggerGameOver();
    }
  }

  submitBet(bet) {
    let pot = bet * 2;
    this.setState({
      totalPot: pot,
      ante: false
    })
  }


  async componentDidMount () {
    const deck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    const initialDeckDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.data.deck_id}/draw/?count=4`);
    let playerDraw = initialDeckDraw.data.cards.slice(0, 2);
    let dealerDraw = initialDeckDraw.data.cards.slice(2);
    let dealerCardImage = dealerDraw[0].image;
    dealerDraw[0].image = 'https://media.istockphoto.com/photos/bicycle-rider-back-playing-card-design-picture-id157772536?k=6&m=157772536&s=170667a&w=0&h=kk9dkMmkrTrkC2kCrXeGIh9PbcoKyJTikLILsakcsbE=';
    this.setState({
      deckId: deck.data.deck_id,
      playerDraw: playerDraw,
      dealerDraw: dealerDraw,
      initialDealerCardImage: dealerCardImage
    })
    this.updateScore(playerDraw, 'player');
    this.updateScore(dealerDraw, 'dealer');
  }

  render() {
    if (this.state.ante) {
      return <Ante chips={this.state.playerChips} submitBet={this.submitBet}/>
    } else {
      if (this.state.playerScore && this.state.dealerScore) {
        if (this.state.winner) {
          return (
            <Winner playerScore={this.state.playerScore} dealerScore={this.state.dealerScore} />
          )
        } else if (this.state.loser) {
          return (
            <Loser playerScore={this.state.playerScore} dealerScore={this.state.dealerScore} />
          )
        } else {
          return (
            <Container>
              <Row id="main-header">
                <h1>BlackJack</h1>
              </Row>
              <Row align="right" id="total-pot">
                <span>Total Pot: <strong>{this.state.totalPot}</strong></span>
              </Row>
              <Row id="main-dealer-row">
                <Dealer draw={this.state.dealerDraw} drawCard={this.drawCard}/>
              </Row>
              <Row className="player-btn-row">
                <Col align="left">
                  <Button variant='success' onClick={() => this.drawCard('player')}>HIT</Button>
                </Col>
                <Col align="right">
                  <Button variant='success' onClick={() => this.drawCard('dealer')}>STAND</Button>
                </Col>
              </Row>
              <Row id="main-player-row">
                <Player
                  draw={this.state.playerDraw}
                  drawCard={this.drawCard}
                  score={this.state.playerScore}
                  chips={this.state.playerChips}
                />
              </Row>
            </Container>
          )
        }
      } else {
        return <span>Loading...</span>
      }
    }
  }
}

export default App;