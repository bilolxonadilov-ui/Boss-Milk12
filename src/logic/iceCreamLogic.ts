/**
 * Pure business logic for Boss Milk ice cream factory
 * Used for calculations, search filters, quiz results, and form validations.
 */

export interface ConeOption {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  price: number;
}

export interface ScoopOption {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  color: string;
  pricePerScoop: number;
}

export interface ToppingOption {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  price: number;
}

export interface IceCreamProduct {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  category: 'waffle' | 'popsicles' | 'tubs' | 'special';
  categoryUz: string;
  categoryEn: string;
  categoryRu: string;
  price: number;
  rating: number;
  image: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  badgeUz?: string;
  badgeEn?: string;
  badgeRu?: string;
}

export const CONES: ConeOption[] = [
  { id: 'waffle-classic', nameRu: 'Хрустящий вафельный рожок', nameUz: 'Qarsildoq vafli konusi', nameEn: 'Crispy Waffle Cone', price: 4000 },
  { id: 'choco-cone', nameRu: 'Шоколадный рожок с кунжутом', nameUz: 'Shokoladli konus kunjutli', nameEn: 'Chocolate Glazed Cone', price: 6000 },
  { id: 'sugar-cone', nameRu: 'Сахарный мини-рожок', nameUz: 'Shirin mini-konus', nameEn: 'Sugar Cone', price: 3000 },
  { id: 'eco-cup', nameRu: 'Эко-стаканчик с ложечкой', nameUz: 'Qoshiqli eko-stakancha', nameEn: 'Eco Craft Cup', price: 2000 }
];

export const FLAVORS: ScoopOption[] = [
  { id: 'vanilla-milk', nameRu: 'Сливочный пломбир Босс', nameUz: 'Qaymoqli Boss plombir', nameEn: 'Boss Milk Classic Vanilla', color: '#FFF6D6', pricePerScoop: 9000 },
  { id: 'belgian-choco', nameRu: 'Бельгийский темный шоколад', nameUz: 'Belgiya qora shokoladi', nameEn: 'Belgian Dark Chocolate', color: '#5C3826', pricePerScoop: 11000 },
  { id: 'pistachio-creme', nameRu: 'Изумрудная фисташка', nameUz: 'Zumrad pista kremi', nameEn: 'Emerald Pistachio Cream', color: '#A9D39E', pricePerScoop: 12000 },
  { id: 'wild-strawberry', nameRu: 'Лесная земляника & йогурт', nameUz: 'O\'rmon qulupnayi & yogurt', nameEn: 'Wild Strawberry & Yogurt', color: '#FF7597', pricePerScoop: 10000 },
  { id: 'mango-passion', nameRu: 'Солнечный манго-маракуйя', nameUz: 'Quyoshli mango-marakuya', nameEn: 'Sunny Mango Passionfruit', color: '#FFAE34', pricePerScoop: 10000 },
  { id: 'lavender-blueberry', nameRu: 'Лаванда с горной черникой', nameUz: 'Tog\' qorag\'ati va lavanda', nameEn: 'Lavender & Wild Blueberry', color: '#9B72CF', pricePerScoop: 11000 }
];

export const TOPPINGS: ToppingOption[] = [
  { id: 'sprinkles', nameRu: 'Радужная посыпка', nameUz: 'Kamalak sepmasi', nameEn: 'Rainbow Sprinkles', price: 3000 },
  { id: 'choco-drizzle', nameRu: 'Теплый шоколадный соус', nameUz: 'Issiq shokolad sirkasi', nameEn: 'Warm Chocolate Fudge', price: 4000 },
  { id: 'caramel-gold', nameRu: 'Соленая карамель', nameUz: 'Tuzli karamel', nameEn: 'Salted Caramel Drizzle', price: 4000 },
  { id: 'pistachio-nuts', nameRu: 'Дробленые фисташки', nameUz: 'Maydalangan pista mag\'zi', nameEn: 'Crushed Pistachios', price: 5000 },
  { id: 'marshmallow', nameRu: 'Мини-маршмеллоу', nameUz: 'Mini-marshmellou', nameEn: 'Fluffy Mini-Marshmallows', price: 3000 },
  { id: 'fresh-berries', nameRu: 'Свежие ягоды малины', nameUz: 'Yangi malina mevalari', nameEn: 'Fresh Raspberries', price: 6000 }
];

/**
 * Calculate total price of custom ice cream in constructor
 */
export function calculateCustomIceCreamPrice(
  coneId: string,
  selectedScoopIds: string[],
  selectedToppingIds: string[]
): number {
  const cone = CONES.find(c => c.id === coneId) || CONES[0];
  let total = cone ? cone.price : 0;

  for (const scoopId of selectedScoopIds) {
    const scoop = FLAVORS.find(f => f.id === scoopId);
    if (scoop) {
      total += scoop.pricePerScoop;
    }
  }

  for (const toppingId of selectedToppingIds) {
    const topping = TOPPINGS.find(t => t.id === toppingId);
    if (topping) {
      total += topping.price;
    }
  }

  return total;
}

/**
 * Format currency in UZS
 */
export function formatCurrencyUZS(amount: number): string {
  return amount.toLocaleString('ru-RU') + ' UZS';
}

/**
 * Filter catalog products by text query and category
 */
export function filterProducts(
  products: IceCreamProduct[],
  query: string,
  categoryFilter: string = 'all'
): IceCreamProduct[] {
  const cleanQuery = (query || '').trim().toLowerCase();

  return products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    if (!matchesCategory) return false;

    if (!cleanQuery) return true;

    const searchable = [
      product.nameRu,
      product.nameUz,
      product.nameEn,
      product.descriptionRu,
      product.descriptionUz,
      product.descriptionEn
    ].join(' ').toLowerCase();

    return searchable.includes(cleanQuery);
  });
}

/**
 * Calculate quiz flavor result based on answer scores
 */
export interface QuizResult {
  flavorKey: string;
  nameRu: string;
  nameUz: string;
  nameEn: string;
  descriptionRu: string;
  descriptionUz: string;
  descriptionEn: string;
  accentColor: string;
  emoji: string;
}

export function determineQuizFlavor(totalPoints: number): QuizResult {
  if (totalPoints <= 4) {
    return {
      flavorKey: 'vanilla-milk',
      nameRu: 'Классический Сливочный Пломбир Boss',
      nameUz: 'Klassik Qaymoqli Boss Plombir',
      nameEn: 'Classic Creamy Boss Vanilla',
      descriptionRu: 'Вы цените уют, надежность и проверенные временем традиции. Настоящая душа любой компании!',
      descriptionUz: 'Siz qulaylik, ishonchlilik va vaqt sinovidan o\'tgan an\'analarni qadrlaysiz. Har qanday davra yuragi!',
      descriptionEn: 'You value comfort, authenticity, and timeless elegance. The true heart of any gathering!',
      accentColor: '#FFF1A8',
      emoji: '🍦'
    };
  } else if (totalPoints <= 7) {
    return {
      flavorKey: 'wild-strawberry',
      nameRu: 'Ягодный Фейерверк & Земляника',
      nameUz: 'O\'rmon Qulupnayi & Mevali Otashin',
      nameEn: 'Wild Strawberry & Berry Fireworks',
      descriptionRu: 'Вы полны оптимизма, искренней радости и вдохновляете окружающих своей яркой энергетикой!',
      descriptionUz: 'Siz ko\'tarinki kayfiyat, samimiy quvonch va boshqalarni ilhomlantiruvchi yorqin energiyaga egasiz!',
      descriptionEn: 'You are full of contagious enthusiasm, vibrant charm, and radiant sunshine!',
      accentColor: '#FF6B8B',
      emoji: '🍓'
    };
  } else if (totalPoints <= 10) {
    return {
      flavorKey: 'belgian-choco',
      nameRu: 'Бельгийский Гранд Трюфель Шоколад',
      nameUz: 'Belgiya Grand Trufel Shokoladi',
      nameEn: 'Belgian Grand Truffle Chocolate',
      descriptionRu: 'Глубокий, страстный и решительный характер. Вы любите премиальное качество и смелые цели!',
      descriptionUz: 'Chuqur, jo\'shqin va qat\'iyatli xarakter. Premium sifat va dadil maqsadlarni sevasiz!',
      descriptionEn: 'Deep, passionate, and ambitious. You seek nothing less than absolute premium luxury!',
      accentColor: '#4A2810',
      emoji: '🍫'
    };
  } else {
    return {
      flavorKey: 'pistachio-creme',
      nameRu: 'Изумрудная Фисташка & Соленая Карамель',
      nameUz: 'Zumrad Pista & Oltin Karamel',
      nameEn: 'Emerald Pistachio & Gold Caramel',
      descriptionRu: 'Истинный гурман и эстет! Вы замечаете тончайшие детали вкуса и всегда выделяетесь из толпы.',
      descriptionUz: 'Haqiqiy nozik did sohibi! Eng nozik ta\'mlarni sezasiz va har doim o\'zgacha ajralib turasiz.',
      descriptionEn: 'A true gourmet and aesthetic connoisseur! Subtle, refined, and always unique.',
      accentColor: '#7BB661',
      emoji: '✨'
    };
  }
}

/**
 * Validate customer order inputs
 */
export interface OrderFormData {
  fullName: string;
  phone: string;
  address: string;
  comment?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    fullName?: string;
    phone?: string;
    address?: string;
  };
}

export function validateOrderForm(data: OrderFormData, lang: 'uz' | 'en' | 'ru' = 'ru'): ValidationResult {
  const errors: { fullName?: string; phone?: string; address?: string } = {};

  const cleanName = (data.fullName || '').trim();
  if (cleanName.length < 2) {
    if (lang === 'uz') errors.fullName = 'Iltimos, ismingizni to\'liq kiriting (kamida 2 ta belgi)';
    else if (lang === 'en') errors.fullName = 'Please enter your full name (at least 2 characters)';
    else errors.fullName = 'Пожалуйста, введите ваше имя (не менее 2 символов)';
  }

  const cleanPhone = (data.phone || '').trim().replace(/[\s\-\(\)]/g, '');
  if (!cleanPhone || cleanPhone.length < 9 || !/^\+?\d{9,15}$/.test(cleanPhone)) {
    if (lang === 'uz') errors.phone = 'To\'g\'ri telefon raqamini kiriting (+998...)';
    else if (lang === 'en') errors.phone = 'Please enter a valid phone number (+998...)';
    else errors.phone = 'Введите корректный номер телефона (+998...)';
  }

  const cleanAddress = (data.address || '').trim();
  if (cleanAddress.length < 5) {
    if (lang === 'uz') errors.address = 'Yetkazib berish manzilini aniq kiriting (kamida 5 ta belgi)';
    else if (lang === 'en') errors.address = 'Please enter a detailed delivery address (at least 5 characters)';
    else errors.address = 'Пожалуйста, укажите точный адрес доставки (не менее 5 символов)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
