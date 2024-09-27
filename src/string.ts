/**
 * 生成一个UUID（通用唯一识别码）
 * 
 * @returns {string} - 生成的UUID字符串
 */
export function generateUUID(): string {
	const s4 = (): string => {
		return ((1 + Math.random()) * 0x10000 | 0)
			.toString(16)
			.substring(1);
	};
	return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

/**
 * 将字符串解析为JSON对象
 * @template T - JSON对象的类型
 * @param {string} str - 要解析的字符串
 * @returns {T | null} - 解析成功返回JSON对象，解析失败返回null
 */
export function str2json<T = any>(str: string): T | null {
  try {
    return JSON.parse(str)
  } catch (error) {
    return null
  }
}

/**
 * 异步解析字符串为对象，这个方法不同于str2json，str2json在解析时会阻塞当前线程，而str2jsonByAsync不会
 * str2json使用的是JSON.parse，而str2jsonByAsync使用的是new Function，
 * 后者适应性更强，可用于解析看起来像json字符串但JSON.parse无法解析的字符串
 * @template T - 解析结果的类型
 * @param {string} str - 要解析的字符串
 * @returns {Promise<T | null>} - 解析成功返回对象，解析失败返回null
 */
export const str2jsonByAsync = async <T = any>(str: string): Promise<T | null> => {
  try {
    const AsyncFunc = Object.getPrototypeOf(async function(){}).constructor;
    const runner = new AsyncFunc(
      `let result;
       try {
         result = ${str};
       } catch (error) {
         result = null;
       }
       return result;`
    );
    return await runner();
  } catch (error) {
    return null;
  }
}