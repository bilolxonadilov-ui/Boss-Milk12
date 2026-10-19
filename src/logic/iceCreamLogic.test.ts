import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCustomIceCreamPrice,
  formatCurrencyUZS,
  filterProducts,
  determineQuizFlavor,
  validateOrderForm,
  CONES,
  FLAVORS,
  TOPPINGS,
  type IceCreamProduct
} from './iceCreamLogic.ts';

test('calculateCustomIceCreamPrice calculates accurate total', () => {
  // Waffle classic (4000) + 2 scoops vanilla (9000*2) + rainbow sprinkles (3000)
  const price = calculateCustomIceCreamPrice('waffle-classic', ['vanilla-milk', 'vanilla-milk'], ['sprinkles']);
  assert.equal(price, 4000 + 18000 + 3000);
});

test('calculateCustomIceCreamPrice handles empty scoops or toppings', () => {
  const price = calculateCustomIceCreamPrice('sugar-cone', [], []);
  assert.equal(price, 3000);
});

test('calculateCustomIceCreamPrice defaults gracefully on unknown cone', () => {
  const price = calculateCustomIceCreamPrice('non-existent', ['pistachio-creme'], ['fresh-berries']);
  assert.equal(price, 4000 + 12000 + 6000);
});

test('formatCurrencyUZS formats numbers with currency tag', () => {
  const formatted = formatCurrencyUZS(25000);
  assert.match(formatted, /25/);
  assert.match(formatted, /UZS/);
});

test('determineQuizFlavor assigns correct flavor profile across score boundaries', () => {
  const low = determineQuizFlavor(3);
  assert.equal(low.flavorKey, 'vanilla-milk');

  const medLow = determineQuizFlavor(6);
  assert.equal(medLow.flavorKey, 'wild-strawberry');

  const medHigh = determineQuizFlavor(9);
  assert.equal(medHigh.flavorKey, 'belgian-choco');

  const high = determineQuizFlavor(12);
  assert.equal(high.flavorKey, 'pistachio-creme');
});

test('filterProducts filters by search term and category correctly', () => {
  const sampleProducts: IceCreamProduct[] = [
    {
      id: 'p1',
      nameRu: 'Пломбир Шоколадный Рожок',
      nameUz: 'Shokoladli Plombir Vafli',
      nameEn: 'Chocolate Plombir Waffle',
      category: 'waffle',
      categoryRu: 'Рожки',
      categoryUz: 'Konuslar',
      categoryEn: 'Cones',
      price: 18000,
      rating: 4.9,
      image: 'test.jpg',
      descriptionRu: 'Шоколадная глазурь и сливки',
      descriptionUz: 'Shokolad va tabiiy qaymoq',
      descriptionEn: 'Rich chocolate and fresh cream'
    },
    {
      id: 'p2',
      nameRu: 'Фруктовый Лед Манго',
      nameUz: 'Meva Muzqaymog\'i Mango',
      nameEn: 'Mango Fruit Popsicle',
      category: 'popsicles',
      categoryRu: 'Эскимо',
      categoryUz: 'Eskimo',
      categoryEn: 'Popsicles',
      price: 14000,
      rating: 4.8,
      image: 'test2.jpg',
      descriptionRu: 'Натуральное пюре альфонсо',
      descriptionUz: 'Tabiiy mango bo\'tqasi',
      descriptionEn: 'Pure alphonso mango'
    }
  ];

  // Search by keyword
  const searchMango = filterProducts(sampleProducts, 'mango');
  assert.equal(searchMango.length, 1);
  assert.equal(searchMango[0].id, 'p2');

  // Search by category
  const waffleOnly = filterProducts(sampleProducts, '', 'waffle');
  assert.equal(waffleOnly.length, 1);
  assert.equal(waffleOnly[0].id, 'p1');

  // Search with no results
  const noMatch = filterProducts(sampleProducts, 'avocado');
  assert.equal(noMatch.length, 0);
});

test('validateOrderForm enforces validation rules', () => {
  // Invalid data
  const invalid = validateOrderForm({
    fullName: 'A',
    phone: '123',
    address: 'No'
  }, 'ru');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.address);

  // Valid data
  const valid = validateOrderForm({
    fullName: 'Alisher Navoiy',
    phone: '+998901234567',
    address: 'Tashkent, Chilonzor 9-kvartal, 14-dom'
  }, 'uz');
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
