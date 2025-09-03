export const PLAYER_DECK = [
  {
    id: 1,
    name: "Golden Retriever",
    cost: 1,
    power: 2,
    image: "/images/puppies/golden-retriever.png",
    ability: "pack_leader",
    description: "Pack Leader: +1 power for each other friendly card here",
    rarity: "common"
  },
  {
    id: 2,
    name: "Beagle Buddy",
    cost: 2,
    power: 3,
    image: "/images/puppies/beagle.png",
    ability: null,
    description: "A loyal companion with steady power",
    rarity: "common"
  },
  {
    id: 3,
    name: "German Shepherd",
    cost: 3,
    power: 4,
    image: "/images/puppies/german-shepherd.png",
    ability: "guard_dog",
    description: "Guard Dog: Protects other cards from negative effects",
    rarity: "rare"
  },
  {
    id: 4,
    name: "Labrador Pup",
    cost: 2,
    power: 2,
    image: "/images/puppies/labrador.png",
    ability: "alpha_dog",
    description: "Alpha Dog: Gives +1 power to all other cards here",
    rarity: "rare"
  },
  {
    id: 5,
    name: "Border Collie",
    cost: 3,
    power: 3,
    image: "/images/puppies/border-collie.png",
  ability: "legendary_aura",
  description: "Legendary Aura: +1 power for each other legendary card here",
    rarity: "legendary"
  },
  {
    id: 6,
    name: "Husky Hero",
    cost: 4,
    power: 6,
    image: "/images/puppies/husky.png",
    ability: null,
    description: "Raw power and endurance",
    rarity: "rare"
  },
  {
    id: 7,
    name: "Poodle Power",
    cost: 1,
    power: 1,
    image: "/images/puppies/poodle.png",
    ability: "alpha_dog",
    description: "Alpha Dog: Gives +1 power to all other cards here",
    rarity: "common"
  },
  {
    id: 8,
    name: "Bulldog Boss",
    cost: 2,
    power: 4,
    image: "/images/puppies/bulldog.png",
    ability: "guard_dog",
    description: "Guard Dog: Protects other cards from negative effects",
    rarity: "rare"
  }
]

export const OPPONENT_DECK = [
  {
    id: 9,
    name: "Chihuahua Champ",
    cost: 1,
    power: 2,
    image: "/images/puppies/chihuahua.png",
    ability: "pack_leader",
    description: "Pack Leader: +1 power for each other friendly card here",
    rarity: "common"
  },
  {
    id: 10,
    name: "Rottweiler Rival",
    cost: 3,
    power: 4,
    image: "/images/puppies/rottweiler.png",
    ability: "guard_dog",
    description: "Guard Dog: Protects other cards from negative effects",
    rarity: "rare"
  },
  {
    id: 11,
    name: "Dalmatian Dash",
    cost: 2,
    power: 3,
    image: "/images/puppies/dalmatian.png",
  ability: "legendary_aura",
  description: "Legendary Aura: +1 power for each other legendary card here",
    rarity: "rare"
  },
  {
    id: 12,
    name: "Corgi Cutie",
    cost: 1,
    power: 1,
    image: "/images/puppies/corgi.png",
    ability: "alpha_dog",
    description: "Alpha Dog: Gives +1 power to all other cards here",
    rarity: "common"
  },
  {
    id: 13,
    name: "Boxer Brawler",
    cost: 3,
    power: 5,
    image: "/images/puppies/boxer.png",
    ability: null,
    description: "Pure fighting spirit",
    rarity: "rare"
  },
  {
    id: 14,
    name: "Great Dane",
    cost: 4,
    power: 7,
    image: "/images/puppies/great-dane.png",
    ability: null,
    description: "Massive presence on the battlefield",
    rarity: "legendary"
  },
  {
    id: 15,
    name: "Shiba Inu",
    cost: 2,
    power: 2,
    image: "/images/puppies/shiba-inu.png",
    ability: "pack_leader",
    description: "Pack Leader: +1 power for each other friendly card here",
    rarity: "common"
  },
  {
    id: 16,
    name: "Australian Shepherd",
    cost: 2,
    power: 3,
    image: "/images/puppies/australian-shepherd.png",
    ability: "alpha_dog",
    description: "Alpha Dog: Gives +1 power to all other cards here",
    rarity: "rare"
  }
]

// Location definitions with special powers
export const LOCATIONS = [
  {
    id: 1,
    name: "🌳 Dog Park",
    description: "+1 power to all cards here",
    effect: "power_boost",
    value: 1
  },
  {
    id: 2,
    name: "🏥 Vet Clinic", 
    description: "Cards here are protected from destruction",
    effect: "protection",
    value: 1
  },
  {
    id: 3,
    name: "🏋️ Training Ground",
    description: "Double the power of 1-cost cards",
    effect: "cost_boost",
    value: 1
  },
  {
    id: 4,
    name: "🦴 Bone Yard",
    description: "Destroyed cards leave +2 power behind",
    effect: "death_power",
    value: 2
  },
  {
    id: 5,
    name: "🏞️ Puppy Park",
    description: "No special effect",
    effect: null,
    value: 0
  },
  {
    id: 6,
    name: "🌸 Flower Garden",
    description: "Cards here get +1 power at end of game",
    effect: "end_game_boost",
    value: 1
  }
]

// Ability calculations
export const calculateCardPower = (card, location, allCardsAtLocation, isPlayer) => {
  let totalPower = card.power;
  
  // Apply location effects
  if (location.effect === "power_boost") {
    totalPower += location.value;
  } else if (location.effect === "cost_boost" && card.cost === location.value) {
    totalPower *= 2;
  } else if (location.effect === "end_game_boost") {
    totalPower += location.value;
  }
  
  // Apply card abilities
  const friendlyCards = allCardsAtLocation.filter(c => c.isPlayer === isPlayer);
  const otherFriendlyCards = friendlyCards.filter(c => c.id !== card.id);
  
  switch (card.ability) {
    case "pack_leader":
      totalPower += otherFriendlyCards.length;
      break;
    case "alpha_dog":
      // Alpha dog effect is applied to OTHER cards, not self
      break;
    case "guard_dog":
      // Guard Dog provides a small coordination bonus to itself when allies are present
      // (real protection effects are handled by gameplay rules; this is a soft buff)
      totalPower += Math.min(2, otherFriendlyCards.length > 0 ? 1 : 0)
      break;
    case "legendary_aura":
      // Legendary aura adds +1 for each other legendary-friendly card here
      totalPower += otherFriendlyCards.filter(c => c.rarity === 'legendary').length
      break;
    default:
      break;
  }
  
  // Apply alpha dog bonuses from other cards
  const alphaDogs = otherFriendlyCards.filter(c => c.ability === "alpha_dog");
  totalPower += alphaDogs.length;

  // Allies benefit from a nearby guard_dog through morale (+1 if any Guard Dog is present)
  const hasGuardDogAlly = otherFriendlyCards.some(c => c.ability === 'guard_dog')
  if (hasGuardDogAlly && card.ability !== 'guard_dog') {
    totalPower += 1
  }
  
  return totalPower;
}
