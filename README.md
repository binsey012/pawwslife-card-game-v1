# 🐾 Puppy Paw Battle

A fun card game inspired by Marvel Snap, featuring adorable animated puppies! Battle it out across 3 Puppy Parks in this strategic turn-based game.

## 🎮 Game Rules

- **Objective**: Win 2 out of 3 Puppy Parks
- **Duration**: 4 turns total
- **Energy System**: Gain energy equal to turn number (1 energy on turn 1, 2 on turn 2, etc.)
- **Gameplay**: Choose one card per turn and place it in one of 3 locations
- **Victory**: Player with highest total power at each location wins that park

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## 🎯 Features

- ✅ Strategic card placement across 3 locations
- ✅ Energy management system
- ✅ AI opponent with random strategy
- ✅ Beautiful Tailwind CSS styling
- ✅ Responsive design
- ✅ End game victory screen
- ✅ Puppy-themed cards and animations

## 📁 Project Structure

```
src/
├── components/
│   ├── Card.jsx           # Individual card component
│   ├── GameBoard.jsx      # 3 location game board
│   ├── GameHeader.jsx     # Turn and energy display
│   ├── PlayerHand.jsx     # Player's card hand
│   └── EndGameScreen.jsx  # Victory/defeat screen
├── data/
│   └── cards.js          # Card definitions for both players
├── App.jsx               # Main game logic
└── main.jsx             # React entry point
```

## 🐶 Adding Puppy Images

Place puppy images in `public/images/puppies/` with these filenames:
- `golden-retriever.png`
- `beagle.png`
- `german-shepherd.png`
- `labrador.png`
- `border-collie.png`
- `husky.png`
- `poodle.png`
- `bulldog.png`
- `chihuahua.png`
- `rottweiler.png`
- `dalmatian.png`
- `corgi.png`
- `boxer.png`
- `great-dane.png`
- `shiba-inu.png`
- `australian-shepherd.png`

*Note: Cards will show a 🐶 emoji if images are not found*

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

The game uses Tailwind CSS for styling. You can customize:
- Card designs in `src/components/Card.jsx`
- Game board layout in `src/components/GameBoard.jsx`
- Color schemes in `tailwind.config.js`
- Add new cards in `src/data/cards.js`

## 🤝 Contributing

Feel free to add more puppy breeds, special abilities, or game mechanics!

---

**Have fun playing Puppy Paw Battle!** 🐾✨
