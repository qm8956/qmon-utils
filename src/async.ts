/**
 * 尝试执行一个Promise，并返回一个包含错误或数据的元组。主要用来在async/await中捕获错误。防止异常导致程序中断
 *
 * @template T - Promise解析的值的类型
 * @param {Promise<T>} promise - 要执行的Promise
 * @returns {Promise<[Error | null, T | null]>} - 一个包含错误或数据的元组
 */
export async function tryit<T = any>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const response = await promise;
    return [null, response];
  } catch (error: any) {
    return [error, null];
  }
}

/**
 * 暂停执行一段时间，使用Promise实现。
 *
 * @param {number} [delay=200] - 暂停的时间，单位为毫秒，默认为200毫秒。
 * @returns {Promise<void>} - 返回一个在指定时间后解析的Promise。
 */
export function sleep(delay = 200): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}