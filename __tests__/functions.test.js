const { rollDice, calculateDamageBonus } = require('../script');

describe('rollDice', () => {
  test('returns value within expected range', () => {
    const result = rollDice(3, 6);
    expect(result).toBeGreaterThanOrEqual(3);
    expect(result).toBeLessThanOrEqual(18);
  });
});

describe('calculateDamageBonus', () => {
  test('returns -1D6 for STR+SIZ <= 12', () => {
    expect(calculateDamageBonus(5, 6)).toBe('-1D6');
  });

  test('returns -1D4 for STR+SIZ between 13 and 16', () => {
    expect(calculateDamageBonus(8, 8)).toBe('-1D4');
  });

  test('returns 0 for STR+SIZ between 17 and 24', () => {
    expect(calculateDamageBonus(12, 12)).toBe('0');
  });

  test('returns +1D4 for STR+SIZ between 25 and 32', () => {
    expect(calculateDamageBonus(16, 16)).toBe('+1D4');
  });

  test('returns +1D6 for STR+SIZ >= 33', () => {
    expect(calculateDamageBonus(18, 18)).toBe('+1D6');
  });
});
