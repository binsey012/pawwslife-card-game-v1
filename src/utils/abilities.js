export const AbilityMap = {
  pack_leader: { key: 'pack_leader', label: 'Pack Leader', icon: '🐾', badgeClass: 'bg-emerald-500 text-white' },
  alpha_dog: { key: 'alpha_dog', label: 'Alpha Dog', icon: '🅰️', badgeClass: 'bg-indigo-500 text-white' },
  guard_dog: { key: 'guard_dog', label: 'Guard Dog', icon: '🛡️', badgeClass: 'bg-blue-600 text-white' },
  playful_pup: { key: 'playful_pup', label: 'Playful Pup', icon: '↔️', badgeClass: 'bg-pink-500 text-white' },
  legendary_aura: { key: 'legendary_aura', label: 'Legendary Aura', icon: '⭐', badgeClass: 'bg-yellow-400 text-black' },
}

export const EffectMap = {
  power_boost: { key: 'power_boost', label: '+1 Power (All)', icon: '💪' },
  protection: { key: 'protection', label: 'Protected', icon: '🛡️' },
  cost_boost: { key: 'cost_boost', label: '1-Cost x2', icon: '⚡' },
  death_power: { key: 'death_power', label: 'Death leaves +2', icon: '💀' },
  end_game_boost: { key: 'end_game_boost', label: '+1 Endgame', icon: '🎯' },
}

export const getAbilityMeta = (ability) => AbilityMap[ability] || null
export const getEffectMeta = (effect) => EffectMap[effect] || null
