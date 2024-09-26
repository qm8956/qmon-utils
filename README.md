# @qmon/utils

这是一个 TypeScript 项目，包含一些实用的工具函数。

## 安装

使用 `pnpm` 安装：

```bash
pnpm install @qmon/utils
```

## 使用

### 1. 导入模块

```typescript
import { appendQueryParams, getUrlParameters, fRate, areaConversion } from '@qmon/utils';
```

### 2. 使用函数

#### appendQueryParams

```typescript
const url = 'https://example.com';
const params = { foo: 'bar', baz: 'qux' };
const updatedUrl = appendQueryParams(url, params);
console.log(updatedUrl); // 输出: https://example.com?foo=bar&baz=qux
```

#### getUrlParameters

```typescript
const url = 'https://example.com?param1=value1&param2=value2';
const params = getUrlParameters(url);
console.log(params); // 输出: { param1: 'value1', param2: 'value2' }
```

#### fRate

```typescript
const area = 100;
const convertedArea = fRate(area, 'm2');
console.log(convertedArea); // 输出: 100
```

#### areaConversion

```typescript
const area = 100;
const convertedArea = areaConversion(area, 'm2');
console.log(convertedArea); // 输出: 100
```
