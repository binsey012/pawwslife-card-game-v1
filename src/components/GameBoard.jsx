import { useRef, useState } from 'react'
import Card from './Card'
import { getEffectMeta } from '../utils/abilities'

// Renders the three locations with player/opponent boards and scores
const GameBoard = ({
  playerBoard = [[], [], []],
  opponentBoard = [[], [], []],
  locations = [],
  playerScore = [0, 0, 0],
  opponentScore = [0, 0, 0],
  gamePhase,
  winner,
  onMoveCard,
  // Optional placement handlers driven by PlayerHand selection/drag
  onPlaceSelectedCard,
  onDropCard,
  selectedCardIndex,
}) => {
  const [hoverLoc, setHoverLoc] = useState(null)
  const containersRef = useRef([])

  const spawnParticles = (container) => {
    if (!container) return
    const host = container.querySelector('.player-zone') || container
    const box = document.createElement('div')
    box.style.position = 'absolute'
    box.style.inset = '0'
    box.style.pointerEvents = 'none'
    box.style.overflow = 'hidden'
    box.className = 'relative'
    container.appendChild(box)
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div')
      el.className = 'particle'
      el.style.left = `${Math.random() * 90 + 5}%`
      el.style.top = `${Math.random() * 40 + 40}%`
      el.style.fontSize = `${12 + Math.random() * 14}px`
      el.textContent = ['🐾','✨','💫'][Math.floor(Math.random()*3)]
      box.appendChild(el)
      setTimeout(() => el.remove(), 1800)
    }
    setTimeout(() => box.remove(), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-6" data-tour="game-board">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((idx) => {
          const loc = locations[idx] || {}
          const meta = loc?.effect ? getEffectMeta(loc.effect) : null
          const isWinner = gamePhase === 'gameOver' && (
            (playerScore[idx] > opponentScore[idx] && winner === 'player') ||
            (opponentScore[idx] > playerScore[idx] && winner === 'opponent')
          )

          return (
            <div
              key={idx}
              className={`location-card p-3 rounded-lg relative ${isWinner ? 'location-winner' : ''} ${hoverLoc===idx ? 'ring-4 ring-yellow-300' : ''}`}
              ref={(el) => (containersRef.current[idx] = el)}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
                setHoverLoc(idx)
              }}
              onDragLeave={() => {
                setHoverLoc((h) => (h === idx ? null : h))
              }}
              onDrop={(e) => {
                const fromDrag = e.dataTransfer.getData('text/paw-card-index')
                const idxFromDrag = fromDrag ? Number(fromDrag) : selectedCardIndex
                if (idxFromDrag == null) return
                onDropCard && onDropCard(idxFromDrag, idx)
                onPlaceSelectedCard && onPlaceSelectedCard(idxFromDrag, idx)
                spawnParticles(containersRef.current[idx])
                setHoverLoc(null)
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {loc?.name || ['Park Alpha', 'Park Beta', 'Park Gamma'][idx]}
                  </div>
                  <div className="text-xs text-slate-600">
                    {loc?.description || 'No special effect'}
                  </div>
                </div>
                <div
                  className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full"
                  title={loc?.description || meta?.label || 'No effect'}
                >
                  <span className="mr-1">{meta?.icon ?? '🏞️'}</span>
                  <span>{meta?.label ?? 'No effect'}</span>
                </div>
              </div>

              {/* Scores */}
              <div className="flex items-center justify-between text-sm font-bold mb-2">
                <div className="text-blue-700">You: {playerScore[idx] || 0}</div>
                <div className="text-pink-700">AI: {opponentScore[idx] || 0}</div>
              </div>

              {/* Opponent Row */}
              <div className="min-h-[84px] flex flex-wrap gap-1 mb-2">
                {(opponentBoard[idx] || []).map((card, i) => (
                  <Card key={`o-${idx}-${i}`} card={card} size="small" isOpponent actualPower={null} canPlay={false} />
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-300 my-2" />

              {/* Player Row */}
              <div className="min-h-[84px] flex flex-wrap gap-1 player-zone">
                {(playerBoard[idx] || []).map((card, i) => (
                  <div key={`p-${idx}-${i}`} className="relative">
                    <Card card={card} size="small" isOpponent={false} actualPower={null} />
                    {/* Move controls */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      <button
                        className="text-[10px] px-1 py-0.5 bg-white/80 rounded border"
                        onClick={() => onMoveCard && onMoveCard(idx, i, Math.max(0, idx - 1))}
                        disabled={idx === 0}
                        title="Move left"
                      >
                        ◀
                      </button>
                      <button
                        className="text-[10px] px-1 py-0.5 bg-white/80 rounded border"
                        onClick={() => onMoveCard && onMoveCard(idx, i, Math.min(2, idx + 1))}
                        disabled={idx === 2}
                        title="Move right"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                ))}
                {selectedCardIndex != null && (
                  <button
                    className="ml-1 text-xs px-2 py-1 bg-green-500 text-white rounded shadow animate-bounce paw-pointer"
                    title="Place selected card here"
                    onClick={() => {
                      onPlaceSelectedCard && onPlaceSelectedCard(selectedCardIndex, idx)
                      spawnParticles(containersRef.current[idx])
                    }}
                  >
                    Place here ✨
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GameBoard
