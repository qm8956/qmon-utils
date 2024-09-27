const htmlStart = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>没有标题</title>
  <style>
    table {
      border-collapse: collapse;
      text-align: center;
    }
    table, td, th {
      border: 1px solid #000;
    }
    td, th {
      text-align: center;
      height: 40px;
      width: 200px;
    }
  </style>
</head>
<body>`;

const htmlEnd = `
</body>
</html>`;

interface ExportColumn {
  title: string;
  dataIndex: string;
  [key: string]: any;
}

interface ExportParams {
  columns: ExportColumn[];
  data: any[];
}

/**
 * 根据列与数据获取组织好的html片段
 * @param {ExportParams} params - 包含列和数据的参数
 * @returns {string} - 生成的HTML片段
 */
export function getTableHtml({ columns, data }: ExportParams): string {
  const getTdContent = (content: any) => content ?? '';
  const headerHtml = columns.map(col => `<th scope="col">${col.title}</th>`).join('');
  const bodyHtml = data.map(item => `
    <tr>
      ${columns.map(col => `<td scope="col">${getTdContent(item[col.dataIndex])}</td>`).join('')}
    </tr>`).join('');
  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

/**
 * 导出Excel文件
 * @param {string | ExportParams} data - 字符串或包含列和数据的对象
 * @param {string} [name='导出excel.xls'] - 导出的文件名，默认为'导出excel.xls'
 */
export function exportExcel(data: string | ExportParams, name = '导出excel.xls'): void {
  const html = typeof data === 'object' ? getTableHtml(data) : data;
  let blob = new Blob([htmlStart + html + htmlEnd], { type: 'text/plain;charset=utf-8' });
  // 解决中文乱码问题
  blob = new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = name; // 报表名称
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
