declare type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}` ? `${P1}${Capitalize<CamelCase<`${P2}${P3}`>>}` : S;

declare type PrefixAndCamelCase<T, Prefix extends string> = {
  [K in keyof T as CamelCase<`${Prefix}${Capitalize<string & K>}`>]: T[K];
};

declare type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
