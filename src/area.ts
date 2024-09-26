export const fRate = {
  sqm2mu: 15 / 10000,
  sqm2ha: 1 / 10000,
  mu2sqm: 10000 / 15,
  mu2ha: 1 / 15,
  ha2sqm: 10000,
  ha2mu: 15,
};

/**
 * 面积单位转换工具函数。
 * 提供平方米（sqm）、亩（mu）、公顷（ha）之间的相互转换。
 *
 * @param {number} val - 待转换的数值。
 * @param {'sqm2mu' | 'sqm2ha' | 'mu2sqm' | 'mu2ha' | 'ha2sqm' | 'ha2mu'} unit='sqm2mu' - 转换的类型，可选值有：
 *   - 'sqm2mu'：平方米转亩。
 *   - 'sqm2ha'：平方米转公顷。
 *   - 'mu2sqm'：亩转平方米。
 *   - 'mu2ha'：亩转公顷。
 *   - 'ha2sqm'：公顷转平方米。
 *   - 'ha2mu'：公顷转亩。
 * @returns {number} 转换后的数值。
 */
export function areaConversion(val: number, unit: keyof typeof fRate = 'sqm2mu'): number {
  return val * fRate[unit];
}