// src/lib/garmentType.js
export function guessGarmentTypeFromTitle(title = '') {
  const s = String(title).toLowerCase()

  // bottoms first (so "sweatpants" doesn't get caught by "sweater")
  if (/(jeans|pants|trousers|slacks|chinos|cargo|joggers|leggings|skirt|shorts|culottes)/.test(s)) return 'bottom'

  // single-piece
  if (/(dress|gown|jumpsuit|romper|onesie)/.test(s)) return 'dress'

  // outerwear (we usually treat as top for try-on)
  if (/(coat|jacket|blazer|parka|trench|windbreaker|puffer|overcoat|cardigan|hoodie)/.test(s)) return 'top'

  // tops
  if (/(top|tee|t[-\s]?shirt|shirt|polo|blouse|sweater|jumper|camisole|tank|henley|hoodie|crewneck|turtleneck)/.test(s)) return 'top'

  return 'unknown'
}
