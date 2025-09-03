import { getEffectMeta } from '../utils/abilities'

const GameHeader = ({ turn, energy, progress, locations = [], onSettingsClick, onLoadGame, onOpenDeckBuilder, onOpenLegend, onOpenHowTo, onOpenTour, turnTimer, hasCustomDeck, onClearCustomDeck, currentUser, onLogout, onDeleteUser }) => {
  return (
    <div className="text-center py-6 px-4">
  <h1 className="text-5xl font-bold text-white mb-4 font-comic animate-bounce-slow" data-tour="header-title">
        🐾 Puppy Paw Battle 🐾
      </h1>
      <div className="flex justify-center items-center gap-8 text-white text-xl font-bold flex-wrap">
  <div className="bg-yellow-500 px-4 py-2 rounded-full shadow-lg" data-tour="turn-indicator">
          ⚡ Turn: {turn}/4
        </div>
  <div className="bg-blue-500 px-4 py-2 rounded-full shadow-lg" data-tour="energy-indicator">
          💎 Energy: {energy}
        </div>
        {turnTimer !== null && (
          <div className="bg-white text-black px-4 py-2 rounded-full shadow-lg">
            ⏱️ {turnTimer}s
          </div>
        )}
        {!!locations.length && (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm" data-tour="location-effects">
      {locations.slice(0,3).map((loc, idx) => {
              const meta = loc?.effect ? getEffectMeta(loc.effect) : null
              return (
        <span key={idx} className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full" title={loc?.description || meta?.label || 'No effect'}>
                  <span>{meta?.icon ?? '🏞️'}</span>
                  <span className="hidden sm:inline">{meta?.label ?? 'No effect'}</span>
                </span>
              )
            })}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={onOpenDeckBuilder} className="bg-green-400 px-3 py-1 rounded">Deck</button>
          {hasCustomDeck && <div className="text-sm bg-white text-black px-2 py-1 rounded">Saved</div>}
          <button onClick={onOpenHowTo} className="bg-white/90 px-3 py-1 rounded text-black border">How to Play</button>
          <button onClick={onOpenTour} className="bg-white/90 px-3 py-1 rounded text-black border" data-tour="start-tour-btn">Start Tour</button>
          <button onClick={onSettingsClick} className="bg-gray-200 px-3 py-1 rounded text-black">Settings</button>
          <button onClick={onOpenLegend} className="bg-white/90 px-3 py-1 rounded text-black border">Legend</button>
          {onLoadGame && <button onClick={onLoadGame} className="bg-white px-3 py-1 rounded text-black">Load</button>}
          {hasCustomDeck && <button onClick={onClearCustomDeck} className="bg-red-400 px-3 py-1 rounded text-white">Clear Saved Deck</button>}
          {currentUser && (
            <div className="ml-2 flex items-center gap-2">
              <div className="text-sm bg-white text-black px-2 py-1 rounded">{currentUser.username}</div>
              <button onClick={onLogout} className="bg-red-500 text-white px-2 py-1 rounded">Logout</button>
              <button onClick={() => onDeleteUser && onDeleteUser(currentUser)} className="bg-gray-800 text-white px-2 py-1 rounded">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameHeader
