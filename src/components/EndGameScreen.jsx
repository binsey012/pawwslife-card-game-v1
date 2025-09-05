import { getEffectMeta } from '../utils/abilities'

const EndGameScreen = ({ winner, playerScore = [0,0,0], opponentScore = [0,0,0], locations = [], onRestart }) => {
  const playerParksWon = playerScore.filter((s, i) => s > opponentScore[i]).length
  const opponentParksWon = opponentScore.filter((s, i) => s > playerScore[i]).length
  const getWinnerMessage = () => {
    switch (winner) {
      case 'player':
        return "🐶✨ You Win! Puppy Victory! ✨🐶"
      case 'opponent':
        return "🐾💔 You Lose! Better luck next time! 💔🐾"
      case 'tie':
        return "🐾🤝 Puppy Friendship! It's a tie! 🤝🐾"
      default:
        return "Game Over!"
    }
  }

  const getWinnerEmoji = () => {
    switch (winner) {
      case 'player':
        return "🎉"
      case 'opponent':
        return "😢"
      case 'tie':
        return "🤗"
      default:
        return "🐾"
    }
  }

  const getLocationResult = (locationIndex) => {
    const playerPower = playerScore[locationIndex]
    const opponentPower = opponentScore[locationIndex]
    
    if (playerPower > opponentPower) return "🏆 YOU WIN"
    if (opponentPower > playerPower) return "❌ AI WINS"
    return "🤝 TIE"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="text-8xl mb-4 animate-bounce">
          {getWinnerEmoji()}
        </div>
        
        <h1 className="text-4xl font-bold mb-6 text-gray-800 font-comic">
          {getWinnerMessage()}
        </h1>

        <div className="text-lg mb-4 text-gray-700">
          Parks won: <span className="font-bold text-green-600">You {playerParksWon}</span> · <span className="font-bold text-red-600">AI {opponentParksWon}</span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Final Scores:</h2>
          <div className="grid grid-cols-3 gap-4">
            {[0,1,2].map((index) => {
              const loc = locations[index]
              const parkName = loc?.name ?? ['🌳 Park Alpha','🏞️ Park Beta','🌸 Park Gamma'][index]
              const meta = loc?.effect ? getEffectMeta(loc.effect) : null
              return (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm">{parkName}</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full" title={loc?.description || meta?.label || 'No effect'}>
                    {meta?.icon ?? '🏞️'} {meta?.label ?? 'No effect'}
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600 mb-1">
                  You: {playerScore[index]}
                </div>
                <div className="text-lg font-bold text-pink-600 mb-2">
                  AI: {opponentScore[index]}
                </div>
                {(() => {
                  const res = getLocationResult(index)
                  const color = res.includes('YOU') ? 'text-green-600' : res.includes('AI') ? 'text-red-600' : 'text-gray-600'
                  return <div className={`text-sm font-bold ${color}`}>{res}</div>
                })()}
              </div>
            )})}
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🐕 Play Again! 🐕
        </button>
      </div>
    </div>
  )
}

export default EndGameScreen
