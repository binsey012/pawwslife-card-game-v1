import { LOCATIONS, calculateCardPower } from '../data/cards'

export class SmartAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty
    this.priorities = {
      easy: { winLocation: 0.3, blockPlayer: 0.2, energyEfficiency: 0.2, cardSynergy: 0.3 },
      medium: { winLocation: 0.4, blockPlayer: 0.3, energyEfficiency: 0.2, cardSynergy: 0.1 },
      hard: { winLocation: 0.5, blockPlayer: 0.4, energyEfficiency: 0.05, cardSynergy: 0.05 }
    }
  }

  // Main decision function
  makeMove(gameState) {
    const { opponentHand, playerBoard, opponentBoard, turn, locations } = gameState
    
    if (opponentHand.length === 0) return null
    
    const availableCards = opponentHand.filter(card => card.cost <= turn)
    if (availableCards.length === 0) return null
    
    const moves = []
    
    // Evaluate each possible move
    for (let cardIndex = 0; cardIndex < availableCards.length; cardIndex++) {
      const card = availableCards[cardIndex]
      
      for (let locationIndex = 0; locationIndex < 3; locationIndex++) {
        const score = this.evaluateMove(card, locationIndex, gameState)
        moves.push({
          cardIndex: opponentHand.indexOf(card),
          locationIndex,
          score,
          card
        })
      }
    }
    
    // Sort by score and pick the best move
    moves.sort((a, b) => b.score - a.score)
    
    // Add some randomness based on difficulty
    const randomness = this.difficulty === 'easy' ? 0.3 : this.difficulty === 'medium' ? 0.1 : 0.05
    const randomFactor = Math.random() * randomness
    
    if (randomFactor > 0.8 && moves.length > 1) {
      return moves[1] // Sometimes pick second best move
    }
    
    return moves[0]
  }

  evaluateMove(card, locationIndex, gameState) {
    const { playerBoard, opponentBoard, turn, locations } = gameState
    let score = 0
    
    const location = locations[locationIndex]
    const playerCardsAtLocation = playerBoard[locationIndex] || []
    const opponentCardsAtLocation = opponentBoard[locationIndex] || []
    
    // Calculate power contribution
    const allCardsAtLocation = [
      ...playerCardsAtLocation.map(c => ({ ...c, isPlayer: true })),
      ...opponentCardsAtLocation.map(c => ({ ...c, isPlayer: false })),
      { ...card, isPlayer: false }
    ]
    
    const cardPower = calculateCardPower(card, location, allCardsAtLocation, false)
    
    // 1. Winning potential
    const currentPlayerPower = this.calculateLocationPower(playerCardsAtLocation, location, true)
    const currentOpponentPower = this.calculateLocationPower(opponentCardsAtLocation, location, false)
    const newOpponentPower = currentOpponentPower + cardPower
    
    const powerDifference = newOpponentPower - currentPlayerPower
    score += powerDifference * 10
    
    // 2. Can we win this location?
    if (newOpponentPower > currentPlayerPower) {
      score += 50 // Bonus for taking the lead
    }
    
    // 3. Are we blocking the player from winning?
    if (currentPlayerPower > currentOpponentPower && newOpponentPower > currentPlayerPower) {
      score += 30 // Bonus for comeback
    }
    
    // 4. Energy efficiency
    const efficiency = cardPower / card.cost
    score += efficiency * 5
    
    // 5. Synergy with existing cards
    const synergyBonus = this.calculateSynergy(card, opponentCardsAtLocation, location)
    score += synergyBonus * 15
    
    // 6. Location effects
    score += this.evaluateLocationBonus(card, location) * 8
    
    // 7. Turn timing
    if (turn >= 3) {
      // Late game: focus on winning locations
      score += powerDifference * 5
    } else {
      // Early game: focus on efficiency and setup
      score += efficiency * 3
    }
    
    return score
  }

  calculateLocationPower(cards, location, isPlayer) {
    return cards.reduce((total, card) => {
      const allCardsAtLocation = cards.map(c => ({ ...c, isPlayer }))
      return total + calculateCardPower(card, location, allCardsAtLocation, isPlayer)
    }, 0)
  }

  calculateSynergy(card, existingCards, location) {
    let synergy = 0
    
    // Alpha Dog synergy
    if (card.ability === 'alpha_dog') {
      synergy += existingCards.length * 2 // Boost for each card it will enhance
    }
    
    // Pack Leader synergy
    if (card.ability === 'pack_leader') {
      synergy += existingCards.length // Gets stronger with allies
    }
    
    // Benefits from existing Alpha Dogs
    const alphaDogs = existingCards.filter(c => c.ability === 'alpha_dog')
    synergy += alphaDogs.length * 3
    
    return synergy
  }

  evaluateLocationBonus(card, location) {
    let bonus = 0
    
    switch (location.effect) {
      case 'power_boost':
        bonus += 2 // Always good
        break
      case 'cost_boost':
        if (card.cost === location.value) {
          bonus += 5 // Excellent for 1-cost cards at Training Ground
        }
        break
      case 'protection':
        bonus += 1 // Slightly valuable
        break
      case 'end_game_boost':
        bonus += 3 // Good late game value
        break
      default:
        bonus += 0
    }
    
    return bonus
  }

  // Evaluate overall game state
  evaluateGameState(gameState) {
    const { playerBoard, opponentBoard, locations } = gameState
    let evaluation = 0
    
    for (let i = 0; i < 3; i++) {
      const playerPower = this.calculateLocationPower(playerBoard[i] || [], locations[i], true)
      const opponentPower = this.calculateLocationPower(opponentBoard[i] || [], locations[i], false)
      
      if (opponentPower > playerPower) {
        evaluation += 10 // AI is winning this location
      } else if (playerPower > opponentPower) {
        evaluation -= 10 // Player is winning this location
      }
      
      evaluation += (opponentPower - playerPower) // Power difference
    }
    
    return evaluation
  }
}
