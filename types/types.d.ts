declare module '*.txt' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.html' {
  const content: string;
  export default content;
}

/**
 * 命令行参数
 * @param fn - 要运行的函数
 * @param args - 函数的参数
 */
declare type Argv<T = string, P = unknown> = {
  fn?: T;
  args?: P;
} | null | undefined;
