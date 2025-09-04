import { useState } from 'react'
import Card from './Card'

const PlayerHand = ({ cards, energy, onPlayCard, selectedCardIndex, onSelectCard, onOpenDeckBuilder, soundManager }) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const handleCardClick = (cardIndex) => {
    const card = cards[cardIndex]
    if (card.cost > energy) {
      alert("Not enough energy! 🐾")
      return
    }
    
    onSelectCard && onSelectCard(cardIndex)
    setShowLocationPicker(true)
  }

  const handleLocationSelect = (locationIndex) => {
    if (selectedCardIndex !== null && selectedCardIndex !== undefined) {
      onPlayCard(selectedCardIndex, locationIndex)
      onSelectCard && onSelectCard(null)
      setShowLocationPicker(false)
    }
  }

  const cancelSelection = () => {
    onSelectCard && onSelectCard(null)
    setShowLocationPicker(false)
  }

  return (
  <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-400 to-orange-300 p-4 shadow-2xl" data-tour="player-hand">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-brown-800 mb-4">
          🐕 Your Puppy Pack 🐕
        </h2>
        
        <div className="flex justify-center gap-3 overflow-x-auto pb-2">
          {cards.map((card, index) => (
            <div 
              key={index}
              className={`cursor-pointer transition-all duration-200 ${
                card.cost > energy ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              } ${selectedCardIndex === index ? 'ring-4 ring-blue-500' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <Card card={card} size="medium" canPlay={card.cost <= energy} />
              <div className="text-center text-xs">{index + 1}</div>
            </div>
          ))}
        </div>

  <div className="flex justify-center mt-2" data-tour="deck-builder-btn">
          <button onClick={onOpenDeckBuilder} className="bg-green-500 text-white px-4 py-1 rounded">Open Deck Builder</button>
        </div>

        {showLocationPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-center">
                Choose a Puppy Park! 🏞️
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <button 
                  onClick={() => handleLocationSelect(0)}
                  className="bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  🌳 Park Alpha
                </button>
                <button 
                  onClick={() => handleLocationSelect(1)}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  🏞️ Park Beta
                </button>
                <button 
                  onClick={() => handleLocationSelect(2)}
                  className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  🌸 Park Gamma
                </button>
              </div>
              <button 
                onClick={cancelSelection}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerHand
