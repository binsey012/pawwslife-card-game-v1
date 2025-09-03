import { AbilityMap, EffectMap } from '../utils/abilities'

export default function LegendModal({ onClose }) {
  const abilities = Object.values(AbilityMap)
  const effects = Object.values(EffectMap)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[480px] max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Legend</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Abilities</h3>
          <div className="grid grid-cols-2 gap-2">
            {abilities.map(a => (
              <div key={a.key} className="flex items-center gap-2 text-sm">
                <span className={`px-1.5 py-0.5 rounded ${a.badgeClass}`}>{a.icon}</span>
                <span className="font-medium">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Location Effects</h3>
          <div className="grid grid-cols-2 gap-2">
            {effects.map(e => (
              <div key={e.key} className="flex items-center gap-2 text-sm">
                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-white">{e.icon}</span>
                <span className="font-medium">{e.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
