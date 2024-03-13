import { dateFormat } from '@auto-blog/utils';
import { TagsServices, TagsEntities } from '..';
import { CommonEntities, CommonTypes } from '..';

export function tagToUserTag(tag: TagsEntities.TagEntity): TagsServices.Tag {
  return tag.name;
}

export function tagsToUserTags(tags: TagsEntities.TagEntity[]): TagsServices.Tag[] {
  return tags.map(tagToUserTag);
}

export function statusToUserStatus(status: CommonEntities.StatusAbstract): CommonTypes.Status {
  const { published, generated } = status;

  return {
    publishedJuejin: published.juejin,
    publishedWeixin: published.weixin,
    publishedXiaohongshu: published.xiaohongshu,
    publishedZhihu: published.zhihu,
    generatedData: generated.data
  };
}

export function timestampToUserTimestamp(timestamp: CommonEntities.TimestampAbstract) {
  const { createdAt, updatedAt } = timestamp;

  return {
    createdAt: dateFormat(createdAt),
    updatedAt: dateFormat(updatedAt)
  };
}

export function dataToUserData<T>(data: T & { tags?: TagsEntities.TagEntity[] } & { status?: CommonEntities.StatusAbstract } & { timestamp?: CommonEntities.TimestampAbstract }) {
  const { tags, status, timestamp, ...rest } = data;

  let userData = { ...rest };

  if (tags) {
    userData = { ...userData, tags: tagsToUserTags(tags) };
  }

  if (status) {
    userData = { ...userData, ...statusToUserStatus(status) };
  }

  if (timestamp) {
    userData = { ...userData, ...timestampToUserTimestamp(timestamp) };
  }

  return userData;
}

export function userStatusToStatus(status: CommonTypes.Status) {
  const { publishedJuejin, publishedWeixin, publishedXiaohongshu, publishedZhihu, generatedData } = status;

  return {
    published: {
      juejin: publishedJuejin,
      weixin: publishedWeixin,
      xiaohongshu: publishedXiaohongshu,
      zhihu: publishedZhihu
    },

    generated: {
      data: generatedData
    }
  };
}

export function userDataToData<T>(data: T & CommonTypes.Status) {
  const { generatedData, publishedJuejin, publishedWeixin, publishedXiaohongshu, publishedZhihu, ...rest } = data;

  return {
    ...rest,

    status: userStatusToStatus(data)
  };
}
