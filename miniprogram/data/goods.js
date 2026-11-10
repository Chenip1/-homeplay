const categories = [
  { id: 'food', name: '食物与零食', icon: '🥣' },
  { id: 'toy', name: '玩具类', icon: '🎾' },
  { id: 'care', name: '护理与健康', icon: '🫧' },
  { id: 'travel', name: '训练与出行', icon: '🐾' },
  { id: 'home', name: '生活与装饰', icon: '🏡' },
  { id: 'special', name: '特殊/运营商品', icon: '🎁' }
]

const rows = {
  food: [
    ['food_dog', '基础狗粮', 50, { hunger: 20 }],
    ['food_jerky', '肉干零食', 40, { hunger: 12 }, true],
    ['food_chew', '磨牙棒', 65, { hunger: 15 }],
    ['food_paste', '营养膏', 95, { hunger: 28 }],
    ['food_festive', '节日罐头', 130, { hunger: 40 }, true]
  ],
  toy: [
    ['toy_rubber', '橡胶磨牙棒', 65, { mood: 12 }],
    ['toy_feeder_ball', '漏食球', 110, { mood: 20 }],
    ['toy_rope', '拔河绳', 75, { mood: 14 }],
    ['toy_plush', '毛绒安抚玩偶', 125, { mood: 24 }],
    ['toy_disc', '飞盘', 90, { mood: 18 }],
    ['toy_roller', '自动滚球', 240, { mood: 36 }],
    ['toy_ball', '小号发声球', 80, { mood: 15 }]
  ],
  care: [
    ['care_shampoo', '宠物香波', 85],
    ['care_brush', '梳毛刷', 70],
    ['care_clipper', '指甲剪', 80],
    ['care_bags', '拾便袋', 25],
    ['care_dewormer', '驱虫药', 150],
    ['care_cleaner', '玩具清洁剂', 55],
    ['care_checkup', '疫苗券/体检券', 280]
  ],
  travel: [
    ['travel_clicker', '训练响片', 55],
    ['travel_leash', '牵引绳', 95],
    ['travel_harness', '项圈/胸背带', 130],
    ['travel_scoop', '拾便夹', 60],
    ['travel_treats', '训练零食包', 85, { hunger: 24 }, true]
  ],
  home: [
    ['home_bed', '狗窝', 230],
    ['home_bowls', '食盆/水盆', 75],
    ['home_pads', '尿垫', 35],
    ['home_raincoat', '雨衣', 145],
    ['home_clothes', '小衣服/配饰', 155],
    ['home_storage', '玩具收纳箱', 120]
  ],
  special: [
    ['special_blanket', '安抚巾', 140],
    ['special_feeder', '自动喂食器', 380],
    ['special_grooming', '美容券', 260],
    ['special_skin', '限定皮肤/项圈', 480]
  ]
}

const goods = categories.flatMap(({ id: type }) => rows[type].map(
  ([id, name, price, effect = null, forCats = false]) => ({
    id, name, type, price, effect, forCats, image: '/assets/items/' + id + '.png'
  })
))

module.exports = { categories, goods }
