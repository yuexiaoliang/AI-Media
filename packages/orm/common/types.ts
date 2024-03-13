import { GeneratedStatusAbstract, PublishedStatusAbstract } from './entities';

export type GeneratedStatus = PrefixAndCamelCase<GeneratedStatusAbstract, 'generated'>;
export type PublishedStatus = PrefixAndCamelCase<PublishedStatusAbstract, 'published'>;
export type Status = GeneratedStatus & PublishedStatus;
