// Sound and music management
export class SoundManager {
  constructor() {
    this.sounds = {}
    this.music = null
    this.soundEnabled = true
    this.musicEnabled = true
    this.volume = 0.7
    this.musicVolume = 0.3
    
    this.loadSounds()
  }

  // Load all game sounds
  loadSounds() {
    // Card play sounds
    this.createSound('cardPlay', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    this.createSound('cardHover', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    
    // UI sounds
    this.createSound('buttonClick', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    this.createSound('locationWin', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    
    // Victory/defeat sounds
    this.createSound('victory', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    this.createSound('defeat', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    this.createSound('tie', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    
    // Special ability sounds
    this.createSound('abilityActivate', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TyvmAcBSuBzvLYiTcJGWi87eeff')
    
    // Puppy sounds
    this.createPuppyBarks()
  }

  // Create synthesized audio for different sounds
  createSound(name, dataUri) {
    try {
      this.sounds[name] = new Audio(dataUri)
      this.sounds[name].volume = this.volume
    } catch (error) {
      console.warn(`Failed to create sound ${name}:`, error)
      // Fallback: create silent audio
      this.sounds[name] = { play: () => {}, pause: () => {} }
    }
  }

  // Create puppy bark variations
  createPuppyBarks() {
    const barkTypes = ['woof', 'bark', 'yip', 'howl', 'whine']
    
    barkTypes.forEach(type => {
      // Using Web Audio API to generate different puppy sounds
      this.sounds[type] = this.generatePuppySound(type)
    })
  }

  generatePuppySound(type) {
    try {
      // Create AudioContext for procedural audio generation
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      return {
        play: () => {
          if (!this.soundEnabled) return
          
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          // Different frequencies for different bark types
          switch (type) {
            case 'woof':
              oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
              oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1)
              break
            case 'bark':
              oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
              oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.1)
              break
            case 'yip':
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
              oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05)
              break
            case 'howl':
              oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
              oscillator.frequency.linearRampToValueAtTime(300, audioContext.currentTime + 0.5)
              break
            case 'whine':
              oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
              oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.3)
              break
          }
          
          gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        }
      }
    } catch (error) {
      console.warn('Web Audio API not supported, using fallback')
      return { play: () => {} }
    }
  }

  // Play specific sounds
  playCardPlay() {
    this.playSound('cardPlay')
    this.playRandomBark()
  }

  playCardHover() {
    this.playSound('cardHover')
  }

  playButtonClick() {
    this.playSound('buttonClick')
  }

  playLocationWin() {
    this.playSound('locationWin')
    this.playSound('woof')
  }

  playVictory() {
    this.playSound('victory')
    setTimeout(() => this.playSound('howl'), 500)
  }

  playDefeat() {
    this.playSound('defeat')
    setTimeout(() => this.playSound('whine'), 300)
  }

  playTie() {
    this.playSound('tie')
    this.playSound('bark')
  }

  playAbilityActivate() {
    this.playSound('abilityActivate')
    this.playSound('yip')
  }

  playRandomBark() {
    if (!this.soundEnabled) return
    
    const barkTypes = ['woof', 'bark', 'yip']
    const randomBark = barkTypes[Math.floor(Math.random() * barkTypes.length)]
    
    // Add slight delay to avoid overlapping with card sound
    setTimeout(() => this.playSound(randomBark), 100)
  }

  // Core sound playing function
  playSound(soundName) {
    if (!this.soundEnabled || !this.sounds[soundName]) return
    
    try {
      const sound = this.sounds[soundName]
      sound.currentTime = 0 // Reset to beginning
      sound.play()
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error)
    }
  }

  // Background music
  startBackgroundMusic() {
    if (!this.musicEnabled) return
    
    try {
      // Create a simple looping melody using Web Audio API
      this.createBackgroundMusic()
    } catch (error) {
      console.warn('Failed to start background music:', error)
    }
  }

  createBackgroundMusic() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const melody = [330, 392, 440, 523, 440, 392, 330] // Simple melody notes
    let noteIndex = 0
    
    const playNote = () => {
      if (!this.musicEnabled) return
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(melody[noteIndex], audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(this.musicVolume * 0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 1)
      
      noteIndex = (noteIndex + 1) % melody.length
      
      setTimeout(playNote, 1000) // Play next note after 1 second
    }
    
    playNote()
  }

  stopBackgroundMusic() {
    this.musicEnabled = false
  }

  // Settings
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled
    if (enabled) {
      this.startBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    Object.values(this.sounds).forEach(sound => {
      if (sound.volume !== undefined) {
        sound.volume = this.volume
      }
    })
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
  }
}
