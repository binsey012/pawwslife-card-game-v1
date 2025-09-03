import { useState } from 'react'

export default function HowToPlayModal({ onClose, onOpenLegend }) {
  const [dontShow, setDontShow] = useState(false)

  const handleStart = () => {
    if (dontShow) {
      try { localStorage.setItem('puppyPawBattle_hideHowTo', '1') } catch {}
    }
    onClose && onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[680px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-extrabold">🐾 How to Play</h2>
          <button onClick={handleStart} className="text-gray-600 hover:text-black text-xl">✕</button>
        </div>

        <div className="space-y-4 text-gray-800">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="font-bold">Goal</div>
              Win more puppy parks than the AI by having higher total power at a park.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">⏳</div>
            <div>
              <div className="font-bold">Turns & Energy</div>
              The game lasts 4 turns. Each turn your ⚡ energy goes up. Cards cost energy to play.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">🃏</div>
            <div>
              <div className="font-bold">Play a Card</div>
              Click a card in your hand, then choose a park (Alpha, Beta, or Gamma). Some cards have special powers!
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">✨</div>
            <div>
              <div className="font-bold">Special Powers</div>
              Pack Leader 🐾 grows with friends, Alpha Dog 🅰️ boosts allies, Guard Dog 🛡️ protects and boosts, Legendary Aura ⭐ loves other legendaries, and some pups can move ↔️.
              <button onClick={onOpenLegend} className="ml-2 text-sm underline text-blue-600">See Legend</button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">🏞️</div>
            <div>
              <div className="font-bold">Park Effects</div>
              Parks can change power (💪), protect cards (🛡️), or give endgame boosts (🎯). Check the pill icons under each park.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">🎮</div>
            <div>
              <div className="font-bold">Tips</div>
              Use number keys 1–8 to pick a card, Space to end turn early, and Esc to cancel selection.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="font-bold">Win</div>
              After 4 turns, whoever wins more parks wins the game. Ties can happen!
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} />
            Don’t show again
          </label>
          <div className="flex gap-2">
            <button onClick={onOpenLegend} className="px-4 py-2 bg-white border rounded">Legend</button>
            <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded font-bold">Let’s Play</button>
          </div>
        </div>
      </div>
    </div>
  )
}
