import { useState, useEffect, useRef } from 'react'
import GameBoard from './components/GameBoard'
import PlayerHand from './components/PlayerHand'
import GameHeader from './components/GameHeader'
import EndGameScreen from './components/EndGameScreen'
import SettingsModal from './components/SettingsModal'
import LegendModal from './components/LegendModal'
import HowToPlayModal from './components/HowToPlayModal'
import Tour from './components/Tour'
import DeckBuilder from './components/DeckBuilder'
import Login from './components/Login'
import { PLAYER_DECK, OPPONENT_DECK, LOCATIONS, calculateCardPower } from './data/cards'
import { SmartAI } from './utils/smartAI'
import { GameStateManager } from './utils/gameStateManager'
import { SoundManager } from './utils/soundManager'

function App() {
  const [gameState, setGameState] = useState({
    turn: 1,
    playerEnergy: 1,
    playerHand: [],
    opponentHand: [],
    playerBoard: [[], [], []], // 3 locations
    opponentBoard: [[], [], []], // 3 locations
    gamePhase: 'playing', // 'playing', 'gameOver'
    winner: null,
    playerScore: [0, 0, 0], // power at each location
    opponentScore: [0, 0, 0],
    locations: [], // Dynamic locations
    gameMode: 'classic', // 'classic', 'blitz', 'tutorial', 'campaign'
    difficulty: 'medium'
  })

  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({})
  const [progress, setProgress] = useState({})
  const [achievements, setAchievements] = useState([])
  const [showAchievement, setShowAchievement] = useState(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState(null)
  const [turnTimer, setTurnTimer] = useState(null)
  const [showDeckBuilder, setShowDeckBuilder] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showHowTo, setShowHowTo] = useState(false)
  const [hasCustomDeck, setHasCustomDeck] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Managers
  const gameStateManager = useRef(new GameStateManager())
  const soundManager = useRef(new SoundManager())
  const smartAI = useRef(new SmartAI())

  // Initialize game
  useEffect(() => {
    initializeGame()
    loadSettings()
    loadProgress()
    checkCustomDeck()
    loadSoundManager()
    try {
      const hide = localStorage.getItem('puppyPawBattle_hideHowTo')
      if (!hide) setShowHowTo(true)
    } catch {}
  }, [])

  const loadSoundManager = () => {
    soundManager.current.loadSounds()
  }

  const loadSettings = () => {
    const savedSettings = gameStateManager.current.loadSettings()
    setSettings(savedSettings)
    
    if (savedSettings.timerEnabled) {
      setTurnTimer(30)
    }
  }

  const loadProgress = () => {
    const savedProgress = gameStateManager.current.loadProgress()
    setProgress(savedProgress)
  }

  const checkCustomDeck = () => {
    const customDeck = gameStateManager.current.loadCustomDeck()
    setHasCustomDeck(!!customDeck)
  }

  const initializeGame = () => {
    const shuffledPlayerDeck = [...PLAYER_DECK].sort(() => Math.random() - 0.5)
    const shuffledOpponentDeck = [...OPPONENT_DECK].sort(() => Math.random() - 0.5)
    const shuffledLocations = [...LOCATIONS].sort(() => Math.random() - 0.5).slice(0, 3)

    setGameState(prev => ({
      ...prev,
      playerHand: shuffledPlayerDeck.slice(0, 4),
      opponentHand: shuffledOpponentDeck.slice(0, 4),
      locations: shuffledLocations,
      gamePhase: 'playing',
      winner: null,
      turn: 1,
      playerEnergy: 1,
      playerBoard: [[], [], []],
      opponentBoard: [[], [], []],
      playerScore: [0, 0, 0],
      opponentScore: [0, 0, 0]
    }))
  }

  const playCard = (cardIndex, locationIndex) => {
    const card = gameState.playerHand[cardIndex]
    if (card.cost > gameState.playerEnergy) return

    // Play SFX for card play
    if (soundManager.current && typeof soundManager.current.playCardPlay === 'function') {
      soundManager.current.playCardPlay()
    }

    const newHand = gameState.playerHand.filter((_, i) => i !== cardIndex)
    const newPlayerBoard = [...gameState.playerBoard]
    newPlayerBoard[locationIndex] = [...newPlayerBoard[locationIndex], card]

    setGameState(prev => ({
      ...prev,
      playerHand: newHand,
      playerBoard: newPlayerBoard,
      playerEnergy: prev.playerEnergy - card.cost
    }))

    // Update scores
    updateScores(newPlayerBoard, gameState.opponentBoard)

    // AI turn after a short delay
    setTimeout(() => {
      aiTurn()
    }, 1000)
  }

  const aiTurn = () => {
    const availableCards = gameState.opponentHand.filter(card => card.cost <= gameState.playerEnergy)
    if (availableCards.length === 0) {
      endTurn()
      return
    }

    const move = smartAI.current.makeMove(gameState, availableCards)
    if (!move) {
      endTurn()
      return
    }

    const newOpponentHand = gameState.opponentHand.filter((_, i) => i !== move.cardIndex)
    const newOpponentBoard = [...gameState.opponentBoard]
    newOpponentBoard[move.locationIndex] = [...newOpponentBoard[move.locationIndex], move.card]

    setGameState(prev => ({
      ...prev,
      opponentHand: newOpponentHand,
      opponentBoard: newOpponentBoard
    }))

    updateScores(gameState.playerBoard, newOpponentBoard)
    
    setTimeout(() => {
      endTurn()
    }, 500)
  }

  const endTurn = () => {
    if (gameState.turn >= 4) {
      endGame()
      return
    }

    setGameState(prev => ({
      ...prev,
      turn: prev.turn + 1,
      playerEnergy: Math.min(prev.turn + 1, 6)
    }))

    if (settings.timerEnabled) {
      setTurnTimer(30)
    }
  }

  const updateScores = (playerBoard, opponentBoard) => {
    const newPlayerScore = [0, 0, 0]
    const newOpponentScore = [0, 0, 0]

    for (let locationIndex = 0; locationIndex < 3; locationIndex++) {
      const location = gameState.locations[locationIndex]
      
      // Calculate player power
      playerBoard[locationIndex].forEach(card => {
        const allCardsAtLocation = [
          ...playerBoard[locationIndex].map(c => ({ ...c, isPlayer: true })),
          ...opponentBoard[locationIndex].map(c => ({ ...c, isPlayer: false }))
        ]
        newPlayerScore[locationIndex] += calculateCardPower(card, location, allCardsAtLocation, true)
      })

      // Calculate opponent power
      opponentBoard[locationIndex].forEach(card => {
        const allCardsAtLocation = [
          ...playerBoard[locationIndex].map(c => ({ ...c, isPlayer: true })),
          ...opponentBoard[locationIndex].map(c => ({ ...c, isPlayer: false }))
        ]
        newOpponentScore[locationIndex] += calculateCardPower(card, location, allCardsAtLocation, false)
      })
    }

    setGameState(prev => ({
      ...prev,
      playerScore: newPlayerScore,
      opponentScore: newOpponentScore
    }))
  }

  const endGame = () => {
    const playerWins = gameState.playerScore.filter((score, i) => score > gameState.opponentScore[i]).length
    const opponentWins = gameState.opponentScore.filter((score, i) => score > gameState.playerScore[i]).length

    let winner = 'tie'
    if (playerWins > opponentWins) {
      winner = 'player'
      if (soundManager.current && typeof soundManager.current.playVictory === 'function') {
        soundManager.current.playVictory()
      }
    } else if (opponentWins > playerWins) {
      winner = 'opponent'
      if (soundManager.current && typeof soundManager.current.playDefeat === 'function') {
        soundManager.current.playDefeat()
      }
    }

    setGameState(prev => ({
      ...prev,
      gamePhase: 'gameOver',
      winner
    }))

    // Update progress and check achievements
    const newAchievements = gameStateManager.current.checkAchievements(winner, gameState)
    if (newAchievements.length > 0) {
      setShowAchievement(newAchievements[0])
      setTimeout(() => setShowAchievement(null), 5000)
    }

    const updatedProgress = gameStateManager.current.updateProgress(winner)
    setProgress(updatedProgress)
  }

  const restartGame = () => {
    initializeGame()
    setSelectedCardIndex(null)
    if (settings.timerEnabled) {
      setTurnTimer(30)
    }
  }

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    gameStateManager.current.saveSettings(newSettings)
    
    if (newSettings.timerEnabled && gameState.gamePhase === 'playing') {
      setTurnTimer(30)
    } else {
      setTurnTimer(null)
    }
  }

  const saveGame = () => {
    if (gameStateManager.current.saveGame(gameState)) {
      alert('Game saved! 🎮')
    } else {
      alert('Failed to save game 😢')
    }
  }

  const loadSavedGame = () => {
    const savedGame = gameStateManager.current.loadGame()
    if (savedGame) {
      setGameState(savedGame)
      alert('Game loaded! 🎮')
    }
  }

  const clearCustomDeck = () => {
    gameStateManager.current.clearCustomDeck()
    setHasCustomDeck(false)
    alert('Custom deck cleared! �️')
  }

  const moveCard = (fromLocation, cardIndex, toLocation) => {
    if (toLocation < 0 || toLocation > 2) return
    
    const newPlayerBoard = [...gameState.playerBoard]
    const card = newPlayerBoard[fromLocation][cardIndex]
    
    newPlayerBoard[fromLocation].splice(cardIndex, 1)
    newPlayerBoard[toLocation].push(card)
    
    setGameState(prev => ({
      ...prev,
      playerBoard: newPlayerBoard
    }))

    updateScores(newPlayerBoard, gameState.opponentBoard)
  }

  // Timer effect
  useEffect(() => {
    if (turnTimer === null || turnTimer <= 0) return

    const timer = setTimeout(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          endTurn()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [turnTimer])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (gameState.gamePhase !== 'playing') return
      
      const num = parseInt(e.key)
      if (num >= 1 && num <= gameState.playerHand.length) {
        setSelectedCardIndex(num - 1)
      }
      
      if (e.key === 'Escape') {
        setSelectedCardIndex(null)
      }
      
      if (e.key === ' ') {
        e.preventDefault()
        endTurn()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameState])

  // User authentication
  const handleLogin = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const handleDeleteAccount = async (user) => {
    if (!confirm('Are you sure you want to delete your account?')) return

    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id })
      })
      
      if (res.ok) {
        gameStateManager.current.deleteUser(user.id)
        setCurrentUser(null)
        alert('Account deleted')
      } else {
        gameStateManager.current.deleteUser(user.id)
        setCurrentUser(null)
        alert('Account deleted (local)')
      }
    } catch (err) {
      gameStateManager.current.deleteUser(user.id)
      setCurrentUser(null)
      alert('Account deleted (local)')
    }
  }

  if (gameState.gamePhase === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
        <EndGameScreen 
          winner={gameState.winner}
          playerScore={gameState.playerScore}
          opponentScore={gameState.opponentScore}
          locations={gameState.locations}
          onRestart={restartGame}
          achievements={achievements}
        />
      </div>
    )
  }

  // Wait until locations are initialized to avoid accessing undefined on first render
  if (!gameState.locations || gameState.locations.length < 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-2">🐾</div>
          <div className="text-xl font-semibold">Loading your puppy parks…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <GameHeader 
        turn={gameState.turn}
        energy={gameState.playerEnergy}
        progress={progress}
        onSettingsClick={() => setShowSettings(true)}
  onOpenLegend={() => setShowLegend(true)}
  onOpenHowTo={() => setShowHowTo(true)}
  onOpenTour={() => setShowTour(true)}
        onLoadGame={gameStateManager.current.hasSavedGame() ? loadSavedGame : null}
        onOpenDeckBuilder={() => setShowDeckBuilder(true)}
  locations={gameState.locations}
        hasCustomDeck={hasCustomDeck}
        onClearCustomDeck={clearCustomDeck}
        turnTimer={turnTimer}
        currentUser={currentUser}
        onLogout={handleLogout}
        onDeleteUser={handleDeleteAccount}
      />
      
      <GameBoard 
        playerBoard={gameState.playerBoard}
        opponentBoard={gameState.opponentBoard}
        locations={gameState.locations}
        gamePhase={gameState.gamePhase}
        winner={gameState.winner}
        playerScore={gameState.playerScore}
        opponentScore={gameState.opponentScore}
        onMoveCard={moveCard}
      />

      <PlayerHand 
        cards={gameState.playerHand}
        energy={gameState.playerEnergy}
        onPlayCard={playCard}
        soundManager={soundManager.current}
        selectedCardIndex={selectedCardIndex}
        onSelectCard={setSelectedCardIndex}
        onOpenDeckBuilder={() => setShowDeckBuilder(true)}
      />

      {!currentUser && (
        <Login onLogin={handleLogin} />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDeckBuilder && (
        <DeckBuilder
          initialDeck={gameState.playerHand}
          onSave={(deck) => {
            setGameState(prev => ({ ...prev, playerHand: deck }))
            setShowDeckBuilder(false)
            setHasCustomDeck(true)
          }}
          onClose={() => setShowDeckBuilder(false)}
        />
      )}

      {showLegend && (
        <LegendModal onClose={() => setShowLegend(false)} />
      )}

      {showHowTo && (
        <HowToPlayModal onClose={() => setShowHowTo(false)} onOpenLegend={() => setShowLegend(true)} />
      )}

      {showTour && (
        <Tour
          steps={[
            { selector: '[data-tour="header-title"]', title: 'Welcome!', text: 'This is Puppy Paw Battle. Let’s learn the basics.' },
            { selector: '[data-tour="turn-indicator"]', title: 'Turns', text: 'You have 4 turns. The counter shows your current turn.' },
            { selector: '[data-tour="energy-indicator"]', title: 'Energy', text: 'Energy increases each turn. You spend it to play cards.' },
            { selector: '[data-tour="location-effects"]', title: 'Parks Effects', text: 'Each park can change power or protect cards. Watch these icons.' },
            { selector: '[data-tour="game-board"]', title: 'Game Board', text: 'Play cards into one of the 3 parks. Highest total wins that park.' },
            { selector: '[data-tour="player-hand"]', title: 'Your Hand', text: 'Click a card, then choose a park to play it.' },
            { selector: '[data-tour="deck-builder-btn"]', title: 'Deck Builder', text: 'Build a custom deck of 8 cards here.' },
          ]}
          onClose={() => setShowTour(false)}
        />
      )}

      {showAchievement && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-black p-4 rounded-lg shadow-lg z-50 animate-bounce-in">
          <div className="text-2xl mb-1">{showAchievement.icon}</div>
          <div className="font-bold">{showAchievement.name}</div>
          <div className="text-sm">{showAchievement.description}</div>
          <button 
            onClick={() => setShowAchievement(null)}
            className="mt-2 text-xs bg-black text-yellow-400 px-2 py-1 rounded"
          >
            Awesome! 🎉
          </button>
        </div>
      )}
    </div>
  )
}

export default App
