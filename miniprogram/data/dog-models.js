// Coat colors and silhouette presets for the rounded, toy-like 3D models.
const presets = {
  tianyuan: ['c78c4d','f1cd94','674731','point','plain',1,1,'curve'],
  poodle: ['b77748','e4ae76','8f573a','drop','curl',0.85,1.05,'short'],
  bichon: ['eee8db','fff8e9','d1c4b4','drop','curl',0.88,0.9,'curve'],
  pomeranian: ['cf793c','f3c184','96502d','point','fluff',0.83,0.86,'curl'],
  corgi: ['c98647','fff0d6','9d6137','big','blaze',1.13,0.58,'short'],
  shiba: ['bd753d','f9e4bc','9c5632','point','mask',0.95,0.91,'curl'],
  schnauzer: ['79746e','d3cbc0','49453f','fold','beard',0.93,0.91,'short'],
  french_bulldog: ['d0a675','f3d8b5','56413b','big','flat',0.88,0.72,'short'],
  westie: ['e8e2d1','fff6e4','c5b9a1','point','beard',0.95,0.75,'curve'],
  husky: ['65616e','f7eadb','47404d','point','mask',1.08,1.04,'fluff'],
  samoyed: ['e9e0d1','fff8ea','cdc1af','point','fluff',1.1,1,'curl'],
  golden: ['c78b4d','f1c78b','a5703d','drop','fluff',1.13,1.03,'fluff'],
  labrador: ['45404a','6d626a','302a32','drop','plain',1.14,1.04,'long'],
  border_collie: ['45404a','fff0dc','342d38','fold','blaze',1.06,0.99,'fluff'],
  german_shepherd: ['b67b4c','dfaa72','4d3833','point','saddle',1.13,1.1,'long'],
  doberman: ['403840','b87749','302830','drop','points',1.07,1.24,'short'],
  akita: ['aa673b','f4d7ae','754534','point','mask',1.19,1.07,'curl'],
  rottweiler: ['43383e','b6794e','352a30','fold','points',1.19,0.98,'short'],
  maltese: ['efe6d9','fff9eb','d2c4b0','drop','silky',0.84,0.73,'fluff']
}

const colors = new Map()
function rgb(hex) {
  if (!colors.has(hex)) {
    colors.set(hex, [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255))
  }
  return colors.get(hex)
}

function dogParts(breedId, outfit, seconds) {
  const key = breedId?.replace(/^dog_/, '')
  const [coat, cream, dark, ears, style, length, legs, tail] = presets[key] || presets.tianyuan
  const parts = []
  const add = (color, x, y, z, sx, sy, sz, angle = 0, taper = 0) =>
    parts.push({ color: rgb(color), x, y, z, sx, sy, sz, angle, taper })
  const breathe = Math.sin(seconds * 3) * 0.017
  const bob = Math.sin(seconds * 2.2) * 0.035
  const headY = 0.37 + (legs - 1) * 0.28 + bob
  const bodyY = -0.27 + (legs - 1) * 0.28 + breathe
  const bodyW = key === 'doberman' ? 0.43 : 0.53
  const faceW = key === 'french_bulldog' ? 0.62 : 0.55
  const pawY = -0.84
  const groundY = -1.05
  const bodyZ = 0.73 * length
  const wag = Math.sin(seconds * 6)
  const longTail = tail !== 'short'
  const segments = tail === 'curl' ? 5 : longTail ? 4 : 2
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const thick = (tail === 'fluff' || tail === 'curl' ? 0.18 : 0.13) * (1 - t * 0.52)
    add(i > 2 && (style === 'mask' || tail === 'fluff') ? cream : coat,
      wag * (0.09 + t * 0.42), bodyY + (tail === 'curl' ? 0.08 + 0.48 * Math.sin(t * 2.4) : 0.05 + (longTail ? 0.34 : 0.13) * t),
      -bodyZ - 0.03 - (longTail ? 0.48 : 0.18) * t, thick, thick * 1.14, thick * 1.42)
  }
  add(coat, 0, bodyY, -0.08, bodyW, 0.46, bodyZ)
  if (style === 'saddle') add(dark, 0, bodyY + 0.19, -0.25, bodyW * 0.98, 0.32, bodyZ * 0.80)
  add(coat, 0, bodyY + 0.12, 0.33, bodyW * 0.87, 0.46, 0.43)
  const whiteFeet = ['blaze','mask','fluff','curl','silky','beard','points'].includes(style)
  for (const side of [-1, 1]) {
    for (const front of [-1, 1]) {
      const z = front === 1 ? 0.36 : -0.51 * length
      const upperY = (bodyY + pawY) / 2
      add(coat, side * bodyW * 0.67, upperY, z, 0.165, (bodyY - pawY) / 2 + 0.11, 0.18)
      add(whiteFeet ? cream : coat, side * bodyW * 0.67, groundY + 0.11, z + 0.075, 0.177, 0.126, 0.235)
    }
  }
  if (style !== 'plain') add(cream, 0, bodyY - 0.04, 0.54, bodyW * 0.66, 0.33, 0.23)
  if (style === 'fluff') {
    for (const side of [-1, 1]) {
      add(coat, side * 0.37, bodyY + 0.12, 0.27, 0.24, 0.39, 0.33, -side * 0.2)
      add(cream, side * 0.23, headY - 0.35, 0.45, 0.31, 0.38, 0.31, -side * 0.25)
    }
  }
  if (outfit?.body) {
    const raincoat = outfit.body === 'home_raincoat'
    const fabric = raincoat ? 'e5a645' : '88a2a7'
    add(fabric, 0, bodyY + 0.10, -0.12, bodyW * 1.08, 0.43, bodyZ * 0.92)
    for (const side of [-1, 1]) {
      add(fabric, side * bodyW * 0.66, bodyY - 0.14, 0.29, 0.205, 0.25, 0.24)
      add(raincoat ? 'f4cf78' : 'e9d5b2', side * bodyW * 0.67, bodyY - 0.30, 0.30, 0.187, 0.064, 0.21)
    }
    add(raincoat ? 'f4cf78' : 'e9d5b2', 0, bodyY + 0.14, 0.39, 0.37, 0.34, 0.215)
    add(raincoat ? 'af7131' : 'b76649', 0, bodyY + 0.12, 0.598, 0.07, 0.07, 0.036)
  }
  if (outfit?.neck) {
    const limited = outfit.neck === 'special_skin'
    add(limited ? 'a75648' : '718764', 0, headY - 0.4, 0.39, 0.40, 0.09, 0.38)
    if (!limited) {
      for (const side of [-1, 1]) {
        add('718764', side * 0.16, headY - 0.60, 0.67, 0.067, 0.23, 0.10, -side * 0.52)
      }
    }
    add('e8b75f', 0, headY - 0.46, 0.758, 0.084, 0.092, 0.048)
  }
  // The ears sit behind the head. A tapered ellipsoid makes an upright ear.
  for (const side of [-1, 1]) {
    const pointed = ears === 'point' || ears === 'big'
    const big = ears === 'big'
    const x = side * (pointed ? 0.37 : 0.52)
    const y = headY + (pointed ? (big ? 0.46 : 0.39) : 0.05)
    const tilt = -side * (pointed ? 0.21 : 0.32) + wag * 0.037
    const earColor = style === 'curl' || style === 'silky' ? coat : dark
    add(pointed ? coat : earColor, x, y, 0.38, big ? 0.245 : 0.205,
      pointed ? (big ? 0.43 : 0.35) : ears === 'fold' ? 0.28 : 0.385, 0.177, tilt, pointed ? (big ? 0.31 : 0.68) : 0)
    if (pointed) add('c78d79', x, y + 0.045, 0.523, big ? 0.14 : 0.118, big ? 0.29 : 0.23, 0.047, tilt, 0.60)
  }
  add(coat, 0, headY, 0.52, faceW, 0.485, 0.46)
  if (style === 'curl' || style === 'fluff' || style === 'silky') {
    for (let i = -2; i <= 2; i++) {
      add(style === 'curl' ? cream : coat, i * 0.18, headY + 0.34 - Math.abs(i) * 0.035, 0.62, 0.195, 0.20, 0.22)
    }
  }
  if (style === 'mask' || style === 'blaze') {
    add(cream, 0, headY + 0.07, 0.91, style === 'mask' ? 0.105 : 0.14, 0.36, 0.10)
  }
  const snout = style === 'flat' ? 0.22 : 0.32
  const muzzle = style === 'flat' || style === 'saddle' ? dark : cream
  const blinkCycle = (seconds + 1.3) % 4.5
  const eyeOpen = blinkCycle < 0.18 ? Math.max(0.09, Math.abs(blinkCycle - 0.09) / 0.09) : 1
  for (const side of [-1, 1]) {
    if (style === 'mask' || style === 'points') {
      add(cream, side * 0.28, headY + 0.12, 0.886, 0.142, style === 'mask' ? 0.16 : 0.075, 0.063, side * 0.17)
    }
    add(muzzle, side * 0.137, headY - 0.175, 0.89, 0.22, 0.163, snout)
    if (style === 'beard' || style === 'silky') {
      add(cream, side * 0.17, headY - 0.27, 0.97, 0.159, 0.21, 0.20, -side * 0.22)
    }
    if (key === 'husky' && eyeOpen > 0.25) add('88bac5', side * 0.253, headY + 0.055, 0.925, 0.095, 0.104 * eyeOpen, 0.051)
    add('302527', side * 0.252, headY + 0.055, 0.959, 0.068, 0.088 * eyeOpen, 0.047)
    if (eyeOpen > 0.46) add('fff3d7', side * 0.252 - 0.015, headY + 0.084, 0.997, 0.020, 0.024, 0.014)
  }
  add('503032', 0, headY - 0.255, 0.91 + snout * 0.73, 0.133, 0.086, 0.065)
  add('d98181', 0.015, headY - 0.286 + Math.sin(seconds * 4) * 0.012, 0.96 + snout * 0.77, 0.062, 0.066, 0.044)
  add('382829', 0, headY - 0.107, 0.91 + snout * 0.91, 0.143, 0.093, 0.095)
  add('9b7671', -0.026, headY - 0.073, 0.99 + snout * 0.91, 0.048, 0.024, 0.018)
  return parts
}

module.exports = { presets, dogParts }
