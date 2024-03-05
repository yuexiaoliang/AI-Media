import { getRandomNotPublishedPkg, publishedPlatformsMap } from '@auto-blog/database/npm-packages';

export { getRandomNotPublishedPkg };

export type GetRandomNotPublishedPkg = typeof getRandomNotPublishedPkg;

export const getPublishedPlatformsMap = () => publishedPlatformsMap;
export type GetPublishedPlatformsMap = typeof getPublishedPlatformsMap;
