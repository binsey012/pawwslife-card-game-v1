import { useState } from 'react'
import { PLAYER_DECK } from '../data/cards'
import { GameStateManager } from '../utils/gameStateManager'

const DeckBuilder = ({ initialDeck, onSave, onClose }) => {
  const [deck, setDeck] = useState(initialDeck)

  const toggleCard = (card) => {
    if (deck.find(c => c.id === card.id)) {
      setDeck(deck.filter(c => c.id !== card.id))
    } else {
  if (deck.length >= 8) return
      setDeck([...deck, card])
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🧩 Deck Builder</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <p className="mb-4 text-sm">Select up to 8 cards for your custom deck.</p>

        <div className="grid grid-cols-4 gap-3">
          {PLAYER_DECK.map(card => {
            const selected = !!deck.find(c => c.id === card.id)
            return (
              <div key={card.id} className={`p-2 border rounded ${selected ? 'border-green-500' : 'border-gray-200'}`}>
                <div className="font-bold text-sm">{card.name}</div>
                <div className="text-xs">Cost: {card.cost} Power: {card.power}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => toggleCard(card)} className={`flex-1 py-1 rounded ${selected ? 'bg-red-400' : 'bg-blue-400'} text-white`}>{selected ? 'Remove' : 'Add'}</button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={() => {
            if (deck.length !== 8) {
              alert('Please select exactly 8 cards for your deck.')
              return
            }
            // Persist custom deck using GameStateManager
            const gsm = new GameStateManager()
            gsm.saveCustomDeck(deck)
            onSave(deck)
          }} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded">Save Deck</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeckBuilder
