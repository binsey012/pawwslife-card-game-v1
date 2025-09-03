import { useState, useEffect } from 'react'
import Card from './Card'
import { calculateCardPower } from '../data/cards'
import { getEffectMeta } from '../utils/abilities'

const GameBoard = ({ playerBoard, opponentBoard, locations, gamePhase, winner, playerScore, opponentScore, onMoveCard }) => {
  const [winningLocations, setWinningLocations] = useState([])
  
  useEffect(() => {
    if (gamePhase === 'gameOver') {
      const winners = []
      for (let i = 0; i < 3; i++) {
        if (playerScore[i] > opponentScore[i]) {
          winners.push({ location: i, winner: 'player' })
        } else if (opponentScore[i] > playerScore[i]) {
          winners.push({ location: i, winner: 'opponent' })
        }
      }
      setWinningLocations(winners)
    }
  }, [gamePhase, playerScore, opponentScore])

  const calculateActualPower = (card, locationIndex, isPlayer) => {
    const location = locations[locationIndex]
    const allCardsAtLocation = [
      ...playerBoard[locationIndex].map(c => ({ ...c, isPlayer: true })),
      ...opponentBoard[locationIndex].map(c => ({ ...c, isPlayer: false }))
    ]
    
    return calculateCardPower(card, location, allCardsAtLocation, isPlayer)
  }

  const getLocationWinner = (locationIndex) => {
    return winningLocations.find(w => w.location === locationIndex)
  }

  const createParticles = (locationIndex) => {
    const particles = []
    for (let i = 0; i < 5; i++) {
      particles.push(
        <div
          key={i}
          className="particle text-yellow-400 text-lg animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`
          }}
        >
          ✨
        </div>
      )
    }
    return particles
  }

  return (
  <div className="px-4 mb-8" data-tour="game-board">
      <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
        {[0, 1, 2].map(locationIndex => {
          const location = locations[locationIndex]
          const locationWinner = getLocationWinner(locationIndex)
          const isWinningLocation = locationWinner !== undefined
          
          return (
            <div 
              key={locationIndex} 
              className={`
                location-card p-4 min-h-[300px] relative overflow-hidden
                ${isWinningLocation ? 'location-winner' : ''}
                ${locationWinner?.winner === 'player' ? 'border-green-500' : ''}
                ${locationWinner?.winner === 'opponent' ? 'border-red-500' : ''}
              `}
            >
              {/* Particle effects for winning locations */}
              {isWinningLocation && createParticles(locationIndex)}
              
              {/* Location Header */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-blue-800 mb-1">
                  {location.name}
                </h3>
                {/* Location effect icon/label */}
                {location?.effect && (() => {
                  const meta = getEffectMeta(location.effect)
                  if (!meta) return null
                  return (
                    <div className="mb-1">
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full" title={location.description || meta.label}>
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                    </div>
                  )
                })()}
                <p className="text-xs text-blue-600 italic">
                  {location.description}
                </p>
                {gamePhase === 'gameOver' && (
                  <div className="mt-2 text-sm font-bold">
                    <div className="text-yellow-600">You: {playerScore[locationIndex]}</div>
                    <div className="text-pink-600">AI: {opponentScore[locationIndex]}</div>
                  </div>
                )}
              </div>
              
              {/* Opponent Cards */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-pink-700">🤖 AI Opponent</p>
                  <div className="text-xs text-pink-600 font-bold">
                    Power: {opponentBoard[locationIndex].reduce((sum, card) => 
                      sum + calculateActualPower(card, locationIndex, false), 0
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[80px] justify-center">
                  {opponentBoard[locationIndex].map((card, cardIndex) => (
                    <div key={`opp-${cardIndex}`} className="animate-slide-in-right">
                      <Card 
                        card={card}
                        size="small"
                        isOpponent={true}
                        actualPower={calculateActualPower(card, locationIndex, false)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-blue-300 my-4 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <span className="text-xs text-blue-500">VS</span>
                </div>
              </div>

              {/* Player Cards */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-yellow-700">🐶 You</p>
                  <div className="text-xs text-yellow-600 font-bold">
                    Power: {playerBoard[locationIndex].reduce((sum, card) => 
                      sum + calculateActualPower(card, locationIndex, true), 0
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[80px] justify-center">
                  {playerBoard[locationIndex].map((card, cardIndex) => (
                    <div key={`player-${cardIndex}`} className="animate-slide-in-left relative">
                      <Card 
                        card={card}
                        size="small"
                        isOpponent={false}
                        actualPower={calculateActualPower(card, locationIndex, true)}
                      />
                      {/* Move controls for playful pups (only when game is playing) */}
                      {card.ability === 'playful_pup' && gamePhase !== 'gameOver' && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                          <button onClick={() => onMoveCard(locationIndex, cardIndex, locationIndex - 1)} className="bg-blue-400 text-white px-2 py-1 rounded">◀</button>
                          <button onClick={() => onMoveCard(locationIndex, cardIndex, locationIndex + 1)} className="bg-blue-400 text-white px-2 py-1 rounded">▶</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Effect Indicator */}
              {location.effect && (
                <div className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                  {location.effect === 'power_boost' && '💪'}
                  {location.effect === 'protection' && '🛡️'}
                  {location.effect === 'cost_boost' && '⚡'}
                  {location.effect === 'death_power' && '💀'}
                  {location.effect === 'end_game_boost' && '🎯'}
                </div>
              )}

              {/* Winner indicator */}
              {isWinningLocation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`
                    text-6xl font-bold animate-bounce-in
                    ${locationWinner.winner === 'player' ? 'text-green-500' : 'text-red-500'}
                  `}>
                    {locationWinner.winner === 'player' ? '🏆' : '❌'}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GameBoard
