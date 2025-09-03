import { useState } from 'react'

const SettingsModal = ({ settings, onUpdateSettings, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onUpdateSettings(localSettings)
    onClose()
  }

  const handleReset = () => {
    const defaultSettings = {
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
    setLocalSettings(defaultSettings)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">🔊 Audio</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Sound Effects</span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    soundEnabled: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Background Music</span>
                <input
                  type="checkbox"
                  checked={localSettings.musicEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    musicEnabled: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Gameplay Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">🎮 Gameplay</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>AI Difficulty</span>
                <select
                  value={localSettings.difficulty}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    difficulty: e.target.value
                  })}
                  className="px-3 py-1 border rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label className="flex items-center justify-between">
                <span>Auto Save</span>
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    autoSave: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Visual Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">👁️ Visual</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Animations</span>
                <input
                  type="checkbox"
                  checked={localSettings.animationsEnabled}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    animationsEnabled: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>High Contrast</span>
                <input
                  type="checkbox"
                  checked={localSettings.highContrast}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    highContrast: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Reduced Motion</span>
                <input
                  type="checkbox"
                  checked={localSettings.reducedMotion}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    reducedMotion: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">♿ Accessibility</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Accessibility Mode</span>
                <input
                  type="checkbox"
                  checked={localSettings.accessibilityMode}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    accessibilityMode: e.target.checked
                  })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
