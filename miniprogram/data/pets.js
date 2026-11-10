const tiers = [
  { id: 'starter', name: '初始' },
  { id: 'beginner', name: '入门' },
  { id: 'common', name: '常见' },
  { id: 'advanced', name: '进阶' },
  { id: 'rare', name: '稀有' },
  { id: 'legendary', name: '传说/限定' }
]

// The portrait slot refers to the dog's position in the 5 × 4 image atlas.
const dogRows = [
  ['dog_tianyuan', '中华田园犬', 0, 'starter', 0],
  ['dog_poodle', '泰迪（贵宾犬）', 350, 'beginner', 1],
  ['dog_bichon', '比熊犬', 600, 'beginner', 2],
  ['dog_pomeranian', '博美犬', 500, 'beginner', 3],
  ['dog_corgi', '柯基犬', 1000, 'common', 4],
  ['dog_shiba', '柴犬', 1100, 'common', 5],
  ['dog_schnauzer', '雪纳瑞', 1100, 'common', 6],
  ['dog_french_bulldog', '法斗', 1300, 'common', 7],
  ['dog_westie', '西高地', 800, 'common', 18],
  ['dog_husky', '哈士奇', 2400, 'advanced', 8],
  ['dog_samoyed', '萨摩耶', 2600, 'advanced', 9],
  ['dog_golden', '金毛', 2900, 'advanced', 10],
  ['dog_labrador', '拉布拉多', 2900, 'advanced', 11],
  ['dog_border_collie', '边境牧羊犬', 4800, 'rare', 12],
  ['dog_german_shepherd', '德国牧羊犬', 4800, 'rare', 13],
  ['dog_doberman', '杜宾犬', 5300, 'rare', 14],
  ['dog_akita', '秋田犬', 10000, 'legendary', 15],
  ['dog_rottweiler', '罗威纳犬', 10000, 'legendary', 16],
  ['dog_maltese', '马尔济斯犬', 7500, 'legendary', 17]
]
const dogs = dogRows.map(([id, name, price, tier, portrait]) => ({
  id, name, price, tier, portrait, type: 'dog',
  offsetX: -(portrait % 5) * 100,
  offsetY: -Math.floor(portrait / 5) * 100
}))
const breedById = Object.fromEntries(dogs.map(b => [b.id, b]))
const dogPortraitAtlas = '/assets/dog-portraits.jpg'

module.exports = { dogs, tiers, breedById, dogPortraitAtlas }
