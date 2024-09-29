
/**
 * 从URL中提取文件名
 * 
 * @param {string} url - 要解析的URL字符串
 * @returns {string} - 提取的文件名，如果路径以斜线结尾则返回'downloaded_file'
 */
export function extractFilenameFromUrl(url: string): string {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filename = pathname.split('/').pop();
  return filename ?? 'downloaded_file';
}

/**
 * 下载文件
 * 
 * @param {string} url - 要下载文件的URL
 * @returns {Promise<void>} - 返回一个Promise，当文件下载完成时resolve
 */
export function downloadFile(url: string): Promise<void> {
  return new Promise((resolve) => {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.target = '_blank';
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href);
    document.body.removeChild(elink);
    resolve();
  });
}

/**
 * 通过网络请求方式下载文件，主要解决图片不同源时无法直接下载而是打开的问题
 * 
 * @param {string} url - 下载文件的url
 * @param {string} [fileName] - 可选的文件名
 * @returns {Promise<void>} - 返回一个Promise，当文件下载完成时resolve
 * 
 * @example
 * requestDownloadFile('https://example.com/image.jpg', 'example.jpg')
 *   .then(() => console.log('下载完成'))
 *   .catch((error) => console.error('下载失败', error));
 */
export async function requestDownloadFile(url: string, fileName?: string): Promise<void> {
  const name = fileName ?? extractFilenameFromUrl(url);
  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error('网络响应失败');
  }
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = downloadUrl;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * 导出数据为JSON文件
 * 
 * @param {any} data - 要导出的数据
 * @param {string} filename - 文件名
 */
export function exportToJsonFile(data: any, filename: string): void {
  const jsonStr = JSON.stringify(data);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * 验证文件是否为JSON文件
 * 
 * @param {File} file - 要验证的文件
 * @returns {boolean} - 如果文件是JSON文件则返回true，否则返回false
 */
export function isValidJsonFile(file: File): boolean {
  return file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
}

/**
 * 读取JSON文件
 * 
 * @param {File} file - 要读取的文件
 * @returns {Promise<any>} - 返回一个Promise，当文件读取完成时resolve
 */
export async function parseJsonFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        resolve(json);
      } catch (error) {
        reject(new Error('JSON解析失败: ' + (error as Error).message));
      }
    };
    reader.onerror = () => {
      reject(new Error('文件读取错误'));
    };
    reader.readAsText(file);
  });
}

/**
 * 选择并读取JSON文件
 * 
 * @returns {Promise<null | object>} - 返回一个Promise，当文件读取完成时resolve
 * 
 * @example
 * // 成功案例
 * chooseAndLoadJsonFile().then(data => {
 *   console.log('文件内容:', data);
 * }).catch(error => {
 *   console.error('读取失败:', error.message);
 * });
 * 
 * // 失败案例：未选择文件
 * chooseAndLoadJsonFile().then(data => {
 *   console.log('文件内容:', data);
 * }).catch(error => {
 *   console.error('读取失败:', error.message); // 输出: 读取失败: 未选择文件
 * });
 * 
 * // 失败案例：选择了非JSON文件
 * chooseAndLoadJsonFile().then(data => {
 *   console.log('文件内容:', data);
 * }).catch(error => {
 *   console.error('读取失败:', error.message); // 输出: 读取失败: 请选择正确的文件，以防止出现意外错误
 * });
 */
export async function chooseAndLoadJsonFile(): Promise<null | object> {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.click();
    fileInput.onchange = async (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        const error = new Error('未选择文件');
        console.warn(error.message);
        return reject(error);
      }

      const file = files[0];
      if (!isValidJsonFile(file)) {
        const error = new Error('请选择正确的文件，以防止出现意外错误');
        console.warn(error.message);
        return reject(error);
      }

      try {
        const json = await parseJsonFile(file);
        resolve(json);
      } catch (error) {
        const parseError = new Error('文件读取错误，请确认选择文件是否正确或文件被改动过: ' + (error as Error).message);
        console.warn(parseError.message);
        reject(parseError);
      }
    };
  });
}