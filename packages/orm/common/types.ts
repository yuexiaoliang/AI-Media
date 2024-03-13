import { CommonEntities } from '..';

export type GeneratedStatus = PrefixAndCamelCase<CommonEntities.GeneratedStatusAbstract, 'generated'>;
export type PublishedStatus = PrefixAndCamelCase<CommonEntities.PublishedStatusAbstract, 'published'>;
export type Status = GeneratedStatus & PublishedStatus;
export type StatusKeys = keyof Status;
