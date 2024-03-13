import { dataToStatus } from '../common/transform';
import { Status } from '../common/types';
import { initDataSource } from '../data-source';
import { EnglishWordEntity } from './entities';

export type EnglishWord = PartialKeys<Omit<EnglishWordEntity, 'status' | 'timestamp' | 'tags'>, 'id'> & Status;

/**
 * 保存
 */
export async function saveEnglishWord(data: EnglishWord) {
  const dataSource = await initDataSource();
  const repository = dataSource.getRepository(EnglishWordEntity);

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    const newData = dataToStatus(data);

    let entity = await repository.findOne({ where: { word: data.word } });

    if (!entity) {
      entity = repository.create(newData);
    } else {
      entity = repository.merge(entity, newData);
    }

    await repository.save(entity);

    await queryRunner.commitTransaction();

    return entity;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error(`[EnglishWord: ${data.word}] -> 保存出错了（${error}）`);
  } finally {
    await queryRunner.release();
  }
}

/**
 * 批量保存
 */
export const saveEnglishWords = async (data: EnglishWord[]) => {
  const total = data.length;
  const dataSource = await initDataSource();

  const errorResult = [];
  const successResult = [];

  for await (const item of data) {
    try {
      const entity = await saveEnglishWord(item);
      successResult.push(entity);
    } catch (error) {
      errorResult.push({ pkg: item.word, error });
    }
    console.log(`[EnglishWords: ${item.word}] -> 已处理 ${successResult.length + errorResult.length}/${total}`);
  }

  await dataSource.destroy();
  return [successResult, errorResult];
};
