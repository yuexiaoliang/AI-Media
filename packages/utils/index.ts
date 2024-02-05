import crypto from 'crypto';
export * as file from './file';

// This function replaces all instances of [[KEY]] in the given template
// with the corresponding value in the values object.
//
// For example, if the template is 'Hello, [[NAME]]' and the values object is
// { NAME: 'John' }, then the result is 'Hello, John'.
export function renderTemplate(template: string, values: { [key: string]: string }): string {
  return template.replace(/\[\[(\w+)\]\]/g, (match, key) => {
    return key in values ? values[key] : match;
  });
}

// 获取以秒为单位的时间戳
export function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// 将字符串转为 md5 值
export function stringToMd5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

// 随机获取数组中的一个元素
export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function defineLogStr(platform: string) {
  type Type = 'error' | 'info' | 'success' | 'default';

  return (text: string, type: Type = 'default') => {
    const iconMap = {
      info: '️⭕',
      error: '❎',
      success: '✅',
      default: '⭕️'
    };
    const icon = iconMap[type] || iconMap['default'];

    return `${icon} [${platform}] -> ${text}`;
  };
}
