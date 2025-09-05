import Card from './Card'

const PlayerHand = ({
  cards = [],
  energy = 0,
  onPlayCard,
  soundManager,
  selectedCardIndex,
  onSelectCard,
  onOpenDeckBuilder,
}) => {
  const canAfford = (card) => card.cost <= energy

  const handleSelect = (idx, card) => {
    if (!canAfford(card)) return
    onSelectCard && onSelectCard(idx)
    if (soundManager && typeof soundManager.playCardHover === 'function') {
      soundManager.playCardHover()
    }
  }

  const handlePlay = (idx) => {
    // Enter placement mode: select the card and guide user to drop/click a park
    const card = cards[idx]
    if (!canAfford(card)) return
    onSelectCard && onSelectCard(idx)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur border-t border-white/20">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-bold" data-tour="player-hand">Your Hand</div>
          <button
            onClick={onOpenDeckBuilder}
            className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            data-tour="deck-builder-btn"
          >
            Open Deck Builder
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cards.length === 0 && (
            <div className="text-white/80 text-sm">No cards available.</div>
          )}
          {cards.map((card, idx) => {
            const affordable = canAfford(card)
            const selected = selectedCardIndex === idx
            return (
              <div
                key={card.id}
                className={`relative ${selected ? 'ring-4 ring-yellow-300 rounded-lg' : ''}`}
                onClick={() => handleSelect(idx, card)}
                draggable={affordable}
                onDragStart={(e) => {
                  if (!affordable) return
                  e.dataTransfer.setData('text/paw-card-index', String(idx))
                  e.dataTransfer.effectAllowed = 'copyMove'
                }}
              >
                <Card card={card} size="medium" canPlay={affordable} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <button
                    className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded shadow"
                    disabled={!affordable}
                    onClick={() => handlePlay(idx)}
                    title="Play this card"
                  >
                    Play
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlayerHand
