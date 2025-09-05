import { useState } from 'react'
import { getAbilityMeta } from '../utils/abilities'

const Card = ({ card, size = "medium", isOpponent = false, canPlay = true, actualPower = null }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const sizeClasses = {
    small: "w-16 h-20 text-xs",
    medium: "w-24 h-32 text-sm",
    large: "w-32 h-40 text-base"
  }

  const rarityColors = {
    common: "border-gray-400 bg-gray-50",
    rare: "border-blue-400 bg-blue-50",
    legendary: "border-yellow-400 bg-yellow-50 shadow-yellow-200"
  }

  const rarityGems = {
    common: "🔸",
    rare: "💎", 
    legendary: "⭐"
  }

  const baseClasses = isOpponent ? "opponent-card" : "player-card"
  const rarityClass = rarityColors[card.rarity] || rarityColors.common

  const displayPower = actualPower !== null ? actualPower : card.power

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${baseClasses}
        ${rarityClass}
  ${canPlay ? 'card-hover transform transition-all duration-300' : 'opacity-60'}
  rounded-lg p-2 flex flex-col items-center justify-between shadow-lg
        ${isOpponent ? 'border-pink-400' : 'border-yellow-400'}
        relative group animate-fade-in
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Rarity Gem */}
      <div className="absolute -top-1 -right-1 text-xs">
        {rarityGems[card.rarity]}
      </div>

      {/* Cost */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs
        ${isOpponent ? 'bg-pink-500' : 'bg-blue-500'}
        shadow-lg
      `}>
        {card.cost}
      </div>

  {/* Puppy Image */}
      <div className="flex-1 flex items-center justify-center relative">
        <img 
          src={card.image || "/images/cards/_placeholder.png"} 
          alt={card.name}
          className="w-full h-full object-cover rounded transition-transform duration-200 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='60'%3E🐶%3C/text%3E%3C/svg%3E"
          }}
        />
        {/* Ability badge */}
        {card.ability && (() => {
          const meta = getAbilityMeta(card.ability)
          if (!meta) return null
          return (
            <div className={`absolute bottom-0 right-0 text-[10px] px-1 py-0.5 rounded ${meta.badgeClass}`} title={meta.label}>
              {meta.icon}
            </div>
          )
        })()}
      </div>

      {/* Name */}
      <div className="text-center font-bold truncate w-full" style={{ fontSize: size === 'small' ? '8px' : '10px' }}>
        {card.name}
      </div>

      {/* Brief description on card (hidden for small cards) */}
      {size !== 'small' && (
        <div className="text-[10px] leading-tight text-gray-700 text-center w-full line-clamp-2">
          {card.description}
        </div>
      )}

      {/* Power */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs
        ${isOpponent ? 'bg-pink-600' : 'bg-orange-500'}
        ${actualPower !== null && actualPower !== card.power ? 'ring-2 ring-green-400 animate-pulse' : ''}
        shadow-lg
      `}>
        {displayPower}
      </div>

      {/* Tooltip */}
      {showTooltip && size !== 'small' && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs">
            <div className="font-bold text-yellow-300">{card.name}</div>
            <div className="text-sm">Cost: {card.cost} | Power: {card.power}</div>
            {actualPower !== null && actualPower !== card.power && (
              <div className="text-sm text-green-300">Current Power: {actualPower}</div>
            )}
            <div className="text-xs text-gray-300 mt-1">{card.description}</div>
            <div className="text-xs text-purple-300 mt-1">
              {rarityGems[card.rarity]} {card.rarity.toUpperCase()}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
