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

declare interface Argv {
  platform?: CommonTypes.PublishedPlatforms;
  setPublished?: CommonTypes.PublishedPlatforms;
  pkg?: string;
  p?: 'npm-packages' | 'type-challenges' | 'english-words';
}
