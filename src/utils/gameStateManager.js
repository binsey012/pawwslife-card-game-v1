// Game state management with local storage
export class GameStateManager {
  constructor() {
    this.storageKey = 'puppyPawBattle_gameState'
    this.settingsKey = 'puppyPawBattle_settings'
    this.progressKey = 'puppyPawBattle_progress'
  this.customDeckKey = 'puppyPawBattle_customDeck'
  this.usersKey = 'puppyPawBattle_users'
  }

  // Save current game state
  saveGame(gameState) {
    try {
      const saveData = {
        ...gameState,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(this.storageKey, JSON.stringify(saveData))
      return true
    } catch (error) {
      console.error('Failed to save game:', error)
      return false
    }
  }

  // Load saved game state
  loadGame() {
    try {
      const savedData = localStorage.getItem(this.storageKey)
      if (!savedData) return null
      
      const gameState = JSON.parse(savedData)
      
      // Check if save is from current version
      if (gameState.version !== '1.0') {
        console.warn('Save file version mismatch')
        return null
      }
      
      return gameState
    } catch (error) {
      console.error('Failed to load game:', error)
      return null
    }
  }

  // Clear saved game
  clearSave() {
    localStorage.removeItem(this.storageKey)
  }

  // Custom deck persistence (player-created decks)
  saveCustomDeck(deck) {
    try {
      localStorage.setItem(this.customDeckKey, JSON.stringify(deck))
      return true
    } catch (error) {
      console.error('Failed to save custom deck:', error)
      return false
    }
  }

  loadCustomDeck() {
    try {
      const saved = localStorage.getItem(this.customDeckKey)
      if (!saved) return null
      return JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load custom deck:', error)
      return null
    }
  }

  clearCustomDeck() {
    localStorage.removeItem(this.customDeckKey)
  }

  // Simple local user store (fallback when no server available)
  loadUsers() {
    try {
      const saved = localStorage.getItem(this.usersKey)
      if (!saved) return []
      return JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load users:', error)
      return []
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.usersKey, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Failed to save users:', error)
      return false
    }
  }

  addUser(user) {
    const users = this.loadUsers()
    users.push(user)
    this.saveUsers(users)
    return user
  }

  deleteUser(userId) {
    let users = this.loadUsers()
    users = users.filter(u => u.id !== userId)
    this.saveUsers(users)
    return true
  }

  findUserByUsername(username) {
    const users = this.loadUsers()
    return users.find(u => u.username === username) || null
  }

  authenticateLocal(username, password) {
    const user = this.findUserByUsername(username)
    if (!user) return null
    if (user.password === password) return user
    return null
  }

  // Check if save exists
  hasSavedGame() {
    return localStorage.getItem(this.storageKey) !== null
  }

  // Settings management
  saveSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      return false
    }
  }

  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.settingsKey)
      if (!savedSettings) return this.getDefaultSettings()
      
      return { ...this.getDefaultSettings(), ...JSON.parse(savedSettings) }
    } catch (error) {
      console.error('Failed to load settings:', error)
      return this.getDefaultSettings()
    }
  }

  getDefaultSettings() {
    return {
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      autoSave: true,
      difficulty: 'medium',
      theme: 'default',
      accessibilityMode: false,
      highContrast: false,
      reducedMotion: false
    }
  }

  // Player progress tracking
  saveProgress(progress) {
    try {
      const currentProgress = this.loadProgress()
      const updatedProgress = { ...currentProgress, ...progress }
      localStorage.setItem(this.progressKey, JSON.stringify(updatedProgress))
      return true
    } catch (error) {
      console.error('Failed to save progress:', error)
      return false
    }
  }

  loadProgress() {
    try {
      const savedProgress = localStorage.getItem(this.progressKey)
      if (!savedProgress) return this.getDefaultProgress()
      
      return { ...this.getDefaultProgress(), ...JSON.parse(savedProgress) }
    } catch (error) {
      console.error('Failed to load progress:', error)
      return this.getDefaultProgress()
    }
  }

  getDefaultProgress() {
    return {
      level: 1,
      experience: 0,
      totalGames: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesTied: 0,
      winStreak: 0,
      bestWinStreak: 0,
      unlockedCards: [],
      achievements: [],
      dailyChallenges: {
        lastCompleted: null,
        streak: 0,
        completed: []
      },
      stats: {
        cardsPlayed: 0,
        locationsWon: 0,
        specialAbilitiesUsed: 0,
        perfectGames: 0 // Won all 3 locations
      }
    }
  }

  // Achievement system
  checkAchievements(gameResult, gameState) {
    const progress = this.loadProgress()
    const newAchievements = []

    // First Win
    if (gameResult === 'win' && progress.gamesWon === 0) {
      newAchievements.push({
        id: 'first_win',
        name: 'First Victory!',
        description: 'Win your first game',
        icon: '🏆',
        unlocked: Date.now()
      })
    }

    // Win Streak achievements
    if (gameResult === 'win') {
      if (progress.winStreak + 1 === 5) {
        newAchievements.push({
          id: 'win_streak_5',
          name: 'Hot Streak',
          description: 'Win 5 games in a row',
          icon: '🔥',
          unlocked: Date.now()
        })
      }
      
      if (progress.winStreak + 1 === 10) {
        newAchievements.push({
          id: 'win_streak_10',
          name: 'Unstoppable',
          description: 'Win 10 games in a row',
          icon: '⚡',
          unlocked: Date.now()
        })
      }
    }

    // Perfect Game (win all 3 locations)
    if (gameResult === 'win') {
      const locationsWon = gameState.playerScore.filter((score, i) => 
        score > gameState.opponentScore[i]
      ).length
      
      if (locationsWon === 3) {
        newAchievements.push({
          id: 'perfect_game',
          name: 'Perfect Victory',
          description: 'Win all 3 locations in a single game',
          icon: '💯',
          unlocked: Date.now()
        })
      }
    }

    // Total games milestones
    const totalGames = progress.totalGames + 1
    if (totalGames === 10) {
      newAchievements.push({
        id: 'games_10',
        name: 'Getting Started',
        description: 'Play 10 games',
        icon: '🎮',
        unlocked: Date.now()
      })
    }

    // Save new achievements
    if (newAchievements.length > 0) {
      const updatedProgress = {
        ...progress,
        achievements: [...progress.achievements, ...newAchievements]
      }
      this.saveProgress(updatedProgress)
    }

    return newAchievements
  }

  // Experience and leveling
  addExperience(amount, reason = '') {
    const progress = this.loadProgress()
    const newXP = progress.experience + amount
    const newLevel = Math.floor(newXP / 100) + 1 // 100 XP per level
    
    const leveledUp = newLevel > progress.level
    
    this.saveProgress({
      experience: newXP,
      level: newLevel
    })

    return {
      gained: amount,
      total: newXP,
      level: newLevel,
      leveledUp,
      reason
    }
  }

  // Daily challenge system
  generateDailyChallenge() {
    const today = new Date().toDateString()
    const challenges = [
      {
        id: 'win_with_budget',
        name: 'Budget Victory',
        description: 'Win a game using only cards that cost 2 or less',
        reward: 50,
        check: (gameState) => {
          // Implementation would check if all played cards cost <= 2
          return true // Placeholder
        }
      },
      {
        id: 'location_master',
        name: 'Location Master',
        description: 'Win 2 different locations in a single game',
        reward: 30,
        check: (gameState) => {
          const locationsWon = gameState.playerScore.filter((score, i) => 
            score > gameState.opponentScore[i]
          ).length
          return locationsWon >= 2
        }
      },
      {
        id: 'ability_user',
        name: 'Special Powers',
        description: 'Play 3 cards with special abilities in one game',
        reward: 40,
        check: (gameState) => {
          // Would need to track abilities used
          return true // Placeholder
        }
      }
    ]

    return {
      date: today,
      challenge: challenges[Math.floor(Math.random() * challenges.length)]
    }
  }

  // Update aggregate progress after a game
  updateProgress(gameResult) {
    const progress = this.loadProgress()
    const next = { ...progress }
    next.totalGames = (next.totalGames || 0) + 1
    if (gameResult === 'win') {
      next.gamesWon = (next.gamesWon || 0) + 1
      next.winStreak = (next.winStreak || 0) + 1
      next.bestWinStreak = Math.max(next.bestWinStreak || 0, next.winStreak)
    } else if (gameResult === 'loss') {
      next.gamesLost = (next.gamesLost || 0) + 1
      next.winStreak = 0
    } else {
      next.gamesTied = (next.gamesTied || 0) + 1
      // Streak unchanged
    }
    this.saveProgress(next)
    return next
  }
}
