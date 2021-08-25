import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';


import Dealer from './Dealer.jsx';
import Player from './Player.jsx';
import Winner from './Winner.jsx';
import Loser from './Loser.jsx';
import Ante from './Ante.jsx';
import Draw from './Draw.jsx';
import GameOver from './GameOver.jsx';
import HighScore from './HighScore.jsx';
import SetHighScore from './SetHighScore.jsx';



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
      draw: false,
      ante: true,
      playerChips: 500,
      totalPot: 0,
      gameOver: false,
      highScore: 500,
      viewHighScores: false,
      setHighScore: false,
      dealerShouldDraw: true,
      dealerScoreShown: '???'
    }

    this.updateScore = this.updateScore.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.triggerDealerWin = this.triggerDealerWin.bind(this);
    this.triggerResults = this.triggerResults.bind(this);
    this.submitBet = this.submitBet.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.getInitialDraw = this.getInitialDraw.bind(this);
    this.submitScore = this.submitScore.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.showHighScores = this.showHighScores.bind(this);
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
      }
      if (cardValue) {
        score += cardValue;
      }
    })
    if (aceStack > 0) {
      if (aceStack + score <= 11) {
        aceStack += 10;
      }
    }
    let tempState = this.state;
    tempState[`${player}Score`] = score + aceStack;
    this.setState(tempState);
  }

  async drawCard(player) {
    if (player === 'player') {
      // Draw player card
      let draw = await axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`);
      if (draw.status === 500) {
        this.drawCard('player')
      } else {
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
            this.triggerDealerWin();
          } else if (this.state.playerScore === 21) {
            this.triggerResults();
          }
        }, 1000)
      }

    } else if (player === 'dealer') {
      // Show dealer score
      this.setState({dealerScoreShown: null});
      // Show initial dealer draw
      let currentDealerHand = this.state.dealerDraw;
      currentDealerHand[0].image = this.state.initialDealerCardImage;
      this.setState({
        dealerDraw: currentDealerHand
      })

      // Draw dealer card if applicable
      if (this.state.dealerScore < 17) {
        let dealerDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`);
        if (dealerDraw.status === 500) {
          this.drawCard('dealer');
        } else {
          setTimeout(() => {
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
                this.setState({dealerShouldDraw: false});
                this.triggerResults();
              }
            }, 1000);
          }, 1000);
        }
      } else {
        this.setState({dealerShouldDraw: false})
        setTimeout(this.triggerResults, 1000);
      }
    }
  }

  triggerDealerWin() {
    if (this.state.playerChips < 5) {
      setTimeout(() => {
        this.handleGameOver();
      }, 750)
    } else if (!this.state.gameOver) {
      setTimeout(() => {
        this.setState({
          loser: true
        })
      }, 750);
    }
  }

  triggerResults() {
    if (this.state.dealerShouldDraw) {
      this.drawCard('dealer');
    }
    if (this.state.playerScore > this.state.dealerScore || this.state.dealerScore > 21) {
      let newChipTotal;
      if (this.state.playerScore === 21) {
        let newPot = this.state.totalPot * 1.5;
        newChipTotal = newPot + this.state.playerChips;
      } else {
        newChipTotal = this.state.totalPot + this.state.playerChips;
      }
      setTimeout(() => {
        this.setState({
          playerChips: newChipTotal,
          winner: true
        })
      }, 750);
    } else if (this.state.playerScore === this.state.dealerScore) {
      let newChipTotal = (this.state.totalPot / 2) + this.state.playerChips;
      setTimeout(() => {
        this.setState({
          playerChips: newChipTotal,
          draw: true
        })
      }, 750);
    } else {
      this.triggerDealerWin();
    }
  }

  submitBet(bet) {
    let pot = bet * 2;
    let chipTotal = this.state.playerChips - bet;
    this.setState({
      totalPot: pot,
      ante: false,
      playerChips: chipTotal
    })
  }

  playAgain(event) {
    if (event) {
      event.preventDefault();
    }
    let highScore = this.state.playerChips > this.state.highScore ? this.state.playerChips : this.state.highScore;
    this.setState({
      ante: true,
      winner: false,
      loser: false,
      draw: false,
      gameOver: false,
      deckId: null,
      playerDraw: null,
      dealerDraw: null,
      initialDealerCardImage: null,
      highScore: highScore,
      viewHighScores: false,
      dealerShouldDraw: true,
      dealerScoreShown: '???',
      totalPot: 0
    })
    this.getInitialDraw();
  }

  handleGameOver() {
    this.setState({
      playerChips: 500,
      gameOver: true
    });
  }

  submitScore(event) {
    event.preventDefault();
    this.setState({
      gameOver:false,
      setHighScore: true
    })
  }

  showHighScores() {
    this.setState({
      setHighScore: false,
      viewHighScores: true
    })
  }

  async getInitialDraw() {
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
    if (this.state.playerScore === 21) {
      this.triggerResults();
    }
  }


  async componentDidMount () {
    this.getInitialDraw()
  }

  render() {
    if (this.state.ante) {
      return <Ante chips={this.state.playerChips} submitBet={this.submitBet}/>
    } else {
      if (this.state.playerScore && this.state.dealerScore) {
        if (this.state.winner) {
          return (
            <Winner
              playerScore={this.state.playerScore}
              dealerScore={this.state.dealerScore}
              chips={this.state.playerChips}
              playAgain={this.playAgain}
            />
          )
        } else if (this.state.loser) {
          return (
            <Loser
              playerScore={this.state.playerScore}
              dealerScore={this.state.dealerScore}
              chips={this.state.playerChips}
              playAgain={this.playAgain}
            />
          )
        } else if (this.state.draw) {
          return (
            <Draw
              playerScore={this.state.playerScore}
              dealerScore={this.state.dealerScore}
              chips={this.state.playerChips}
              playAgain={this.playAgain}
            />
          )
        } else if (this.state.gameOver) {
          return (
            <GameOver
              playerScore={this.state.playerScore}
              dealerScore={this.state.dealerScore}
              chips={this.state.playerChips}
              playAgain={this.playAgain}
              highScore={this.state.highScore}
              submitScore={this.submitScore}
            />
          )
        } else if (this.state.setHighScore) {
          return (
            <SetHighScore
              showHighScores={this.showHighScores}
              score={this.state.highScore}
            />
          )
        } else if (this.state.viewHighScores) {
          return (
            <HighScore playAgain={this.playAgain} />
          )
        } else {
          return (
            <Container>
              <Row id="main-header">
                <h1>BlackJack</h1>
              </Row>
              <Row id="total-pot">
                <Col md={4}>
                  <span>Dealer Score: {this.state.dealerScoreShown || this.state.dealerScore}</span>
                </Col>
                <Col md={{span: 4, offset: 4}}>
                  <span>Total Pot: <strong>{this.state.totalPot}</strong></span>
                </Col>
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