import { DataSource } from '..';
import { TagsEntities } from '..';

export type Tag = TagsEntities.TagEntity['name'];

/**
 * 保存标签
 */
export async function saveTag(tag: Tag) {
  const dataSource = await DataSource.initDataSource();

  const repository = dataSource.getRepository(TagsEntities.TagEntity);

  try {
    let tagEntity = await repository.findOne({ where: { name: tag } });

    if (!tagEntity) {
      tagEntity = repository.create({ name: tag });
      await repository.save(tagEntity);
    }

    return tagEntity;
  } catch (error) {
    throw new Error(`[Tag: ${tag}] -> 保存出错了（${error}）`);
  }
}

/**
 * 批量保存标签
 */
export async function saveTags(tags: Tag[]) {
  return await Promise.all(tags.map(async (tag) => await saveTag(tag)));
}
