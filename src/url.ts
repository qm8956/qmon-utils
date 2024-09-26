/**
 * 将对象中的所有键值对添加到URL的查询参数中。
 * 
 * @param {string} url - 原始URL，可以是绝对路径或相对路径。
 * @param {Object} params - 包含要添加到URL查询参数的对象。
 * @return {string} 返回更新后的URL。
 * 
 * 示例：
 * const url = "http://example.com/page";
 * const params = { foo: "bar", baz: "qux" };
 * const updatedUrl = appendQueryParams(url, params);
 * console.log(updatedUrl); // 输出: http://example.com/page?foo=bar&baz=qux
 */
export function appendQueryParams(url: string, params: object) {
	// 解析URL，获取基础URL和现有的查询参数
	const urlObj = new URL(url, window.location.origin);
	const searchParams = urlObj.searchParams;
	// 遍历对象中的每个键值对，添加到查询参数中
	for (const [key, value] of Object.entries(params)) {
			searchParams.set(key, value);
	}
	// 更新URL的查询字符串
	urlObj.search = searchParams.toString();
	// 返回更新后的URL
	return urlObj.href;
}

/**
 * 从给定的URL中提取查询参数，并将其作为对象返回。
 * 如果URL中不包含任何查询参数，则返回undefined。
 *
 * @param {string} url - 要提取查询参数的URL。
 * @return {object} 包含查询参数的键值对对象。如果没有找到参数，则返回空对象。
 *
 * 示例用法：
 * const params = getUrlParameters('https://example.com/page?param1=value1&param2=value2');
 * // params 将会是 { param1: 'value1', param2: 'value2' }
 */
export const getUrlParameters = (url: string): Record<string, string> => {
  // 使用正则表达式匹配URL中的所有查询参数
  const regex = /([^?=&]+)(=([^&]*))/g;
  const matches = url.match(regex);

  // 如果没有匹配到任何内容，返回undefined
  if (!matches) {
    return {};
  }

  // 将匹配到的数组缩减为一个对象，其中每个键是参数名，每个值是对应的参数值
  return matches.reduce((accumulator: Record<string, string>, current) => {
    const [, key, , value] = current.split('=');
    accumulator[key] = value;
    return accumulator;
  }, {});
};