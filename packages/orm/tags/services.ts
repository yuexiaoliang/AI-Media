import { initDataSource } from '../data-source';
import { TagEntity } from './entities';
import { Tag } from './types';

/**
 * 保存标签
 */
export async function saveTag(tag: Tag) {
  const dataSource = await initDataSource();

  const repository = dataSource.getRepository(TagEntity);

  try {
    let tagEntity = await repository.findOne({ where: { name: tag } });

    if (!tagEntity) {
      tagEntity = repository.create({ name: tag });
      await repository.save(tagEntity);
    }

    return tagEntity;
  } catch (error) {
    console.error(`[Tag: ${tag}] -> 保存出错了（${error.message}）`);
  }
}

/**
 * 批量保存标签
 */
export async function saveTags(tags: Tag[]) {
  return await Promise.all(tags.map(async (tag) => await saveTag(tag)));
}
