# 🔧 Technical Documentation - Puppy Paw Battle

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Data Storage  │
│   (React/Vite)  │◄──►│   (Express.js)  │◄──►│   (JSON Files)  │
│   Port 5181     │    │   Port 5175     │    │   Local FS      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Hierarchy
```
App.jsx
├── Login.jsx (Modal)
├── GameHeader.jsx
├── GameBoard.jsx
│   └── Card.jsx (x6 per location)
├── PlayerHand.jsx
│   └── Card.jsx (x8 max)
├── DeckBuilder.jsx (Modal)
├── HowToPlayModal.jsx
├── LegendModal.jsx
├── Tour.jsx (Overlay)
├── EndGameScreen.jsx
└── SettingsModal.jsx
```

## State Management

### App-Level State
```javascript
// User Authentication
const [currentUser, setCurrentUser] = useState(null)

// Game State
const [gameState, setGameState] = useState('playing') // 'playing' | 'ended'
const [turn, setTurn] = useState(1) // 1-4
const [energy, setEnergy] = useState(1) // Available energy
const [locations, setLocations] = useState([]) // 3 park locations

// Card State
const [playerHand, setPlayerHand] = useState([]) // Player's cards
const [playerBoard, setPlayerBoard] = useState([[], [], []]) // Cards at locations
const [opponentBoard, setOpponentBoard] = useState([[], [], []])

// UI State
const [selectedCardIndex, setSelectedCardIndex] = useState(null)
const [showDeckBuilder, setShowDeckBuilder] = useState(false)
const [showSettings, setShowSettings] = useState(false)
const [showTour, setShowTour] = useState(false)
```

### Data Flow
1. **User Input** → Component Event Handler
2. **Event Handler** → State Update Function
3. **State Update** → React Re-render
4. **Re-render** → UI Update + Side Effects

## Game Logic Engine

### Turn System
```javascript
const nextTurn = () => {
  if (turn < 4) {
    setTurn(turn + 1)
    setEnergy(turn + 1) // Energy = turn number
    // AI plays their card
    setTimeout(() => {
      playAICard()
    }, 1000)
  } else {
    endGame()
  }
}
```

### Power Calculation
```javascript
export function calculateCardPower(card, cards, locationIndex, isPlayer) {
  let power = card.power
  
  // Base ability effects
  switch (card.ability) {
    case 'pack_leader':
      // +1 for each ally at same location
      const allies = cards.filter(c => c.id !== card.id)
      power += allies.length
      break
      
    case 'alpha_dog':
      // Boosts others, slight self-boost
      power += cards.length > 1 ? 1 : 0
      break
      
    case 'guard_dog':
      // Protection and coordination
      power += cards.length > 1 ? 1 : 0
      break
      
    case 'legendary_aura':
      // +1 for each other legendary
      const legendaries = cards.filter(c => 
        c.id !== card.id && c.rarity === 'legendary'
      )
      power += legendaries.length
      break
  }
  
  return power
}
```

### AI Decision Making
```javascript
export function makeAIMove(gameState) {
  const { hand, board, locations, energy } = gameState
  
  // Filter playable cards
  const playableCards = hand.filter(card => card.cost <= energy)
  
  // Evaluate each possible move
  const moves = []
  playableCards.forEach(card => {
    locations.forEach((location, locationIndex) => {
      const score = evaluateMove(card, locationIndex, gameState)
      moves.push({ card, locationIndex, score })
    })
  })
  
  // Select best move
  moves.sort((a, b) => b.score - a.score)
  return moves[0] || null
}
```

## Data Models

### Card Schema
```typescript
interface Card {
  id: string           // Unique identifier
  name: string         // Display name
  cost: number         // Energy cost (1-4)
  power: number        // Base power value
  ability?: string     // Special ability key
  rarity: 'common' | 'rare' | 'legendary'
  description: string  // Card description
  image: string        // Image path
}
```

### Location Schema
```typescript
interface Location {
  id: string
  name: string
  effect: string       // Effect type key
  description: string  // Effect description
}
```

### User Schema
```typescript
interface User {
  username: string
  password: string     // Hashed in production
  stats: {
    gamesPlayed: number
    gamesWon: number
    favoriteCard: string
  }
  customDecks: Card[][]
  settings: UserSettings
}
```

## API Layer

### Authentication Service
```javascript
// Frontend API calls
export const authService = {
  async register(username, password) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return response.json()
  },
  
  async login(username, password) {
    // Similar implementation
  },
  
  async deleteUser(username) {
    // Similar implementation
  }
}
```

### Backend Endpoints
```javascript
// Express.js routes
app.post('/api/register', (req, res) => {
  const { username, password } = req.body
  
  // Check if user exists
  if (users.find(u => u.username === username)) {
    return res.json({ success: false, error: 'User exists' })
  }
  
  // Create new user
  const newUser = { username, password }
  users.push(newUser)
  saveUsers()
  
  res.json({ success: true, user: { username } })
})
```

## Performance Optimizations

### React Optimizations
```javascript
// Memoized card component
const Card = React.memo(({ card, size, isOpponent, canPlay }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for re-render optimization
  return prevProps.card.id === nextProps.card.id &&
         prevProps.canPlay === nextProps.canPlay
})

// Lazy loading for heavy components
const DeckBuilder = React.lazy(() => import('./DeckBuilder'))
```

### Asset Loading
```javascript
// Preload critical images
const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}
```

### State Updates
```javascript
// Batch state updates for better performance
const playCard = useCallback((cardIndex, locationIndex) => {
  setGameState(prevState => ({
    ...prevState,
    playerHand: prevState.playerHand.filter((_, i) => i !== cardIndex),
    playerBoard: prevState.playerBoard.map((location, i) => 
      i === locationIndex 
        ? [...location, prevState.playerHand[cardIndex]]
        : location
    ),
    energy: prevState.energy - prevState.playerHand[cardIndex].cost
  }))
}, [])
```

## Security Considerations

### Input Validation
```javascript
// Sanitize user inputs
const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/
  return regex.test(username)
}

// Prevent XSS attacks
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '')
}
```

### Authentication
```javascript
// In production, use proper password hashing
const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}
```

## Testing Strategy

### Unit Testing
```javascript
// Card power calculation tests
describe('calculateCardPower', () => {
  test('pack_leader ability adds power for allies', () => {
    const card = { power: 2, ability: 'pack_leader' }
    const allies = [{ id: 'ally1' }, { id: 'ally2' }]
    const result = calculateCardPower(card, allies, 0, true)
    expect(result).toBe(4) // 2 base + 2 allies
  })
})
```

### Integration Testing
```javascript
// Game flow testing
describe('Game Flow', () => {
  test('complete game from start to finish', () => {
    // Initialize game
    // Play 4 turns
    // Verify winner determination
    // Check state consistency
  })
})
```

### E2E Testing
```javascript
// Cypress tests
describe('Puppy Paw Battle E2E', () => {
  it('allows user to play a complete game', () => {
    cy.visit('/')
    cy.get('[data-testid="register"]').click()
    cy.get('[data-testid="username"]').type('testuser')
    cy.get('[data-testid="password"]').type('testpass')
    // Continue test flow...
  })
})
```

## Deployment Guide

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build

# Build outputs to ./dist/
# Contains optimized HTML, CSS, JS bundles
```

### Environment Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5181,
    proxy: {
      '/api': 'http://localhost:5175'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
})
```

### Production Deployment
```bash
# Static hosting (Netlify, Vercel)
npm run build
# Deploy ./dist/ folder

# Server deployment
npm run build
npm run server
# Serve both static files and API
```

## Monitoring & Analytics

### Error Tracking
```javascript
// Error boundary component
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo)
    // Send to monitoring service
  }
}
```

### Performance Monitoring
```javascript
// Track game performance
const trackGameMetrics = () => {
  performance.mark('game-start')
  // ... game logic
  performance.mark('game-end')
  performance.measure('game-duration', 'game-start', 'game-end')
}
```

### User Analytics
```javascript
// Track user behavior (privacy-compliant)
const trackEvent = (eventName, properties) => {
  // Anonymous analytics only
  console.log('Event:', eventName, properties)
}
```

## Maintenance & Updates

### Version Management
```json
{
  "version": "1.0.0",
  "scripts": {
    "version": "npm version patch && git push --tags"
  }
}
```

### Update Strategy
1. **Patch Updates**: Bug fixes, small improvements
2. **Minor Updates**: New features, card additions
3. **Major Updates**: Architecture changes, new game modes

### Backup Strategy
```bash
# Backup user data
cp server/users.json backup/users-$(date +%Y%m%d).json

# Backup custom decks
# Stored in localStorage - export functionality needed
```

---

This technical documentation provides the foundation for maintaining, extending, and deploying the Puppy Paw Battle game system.
