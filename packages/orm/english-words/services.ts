import { DataSource } from '..';
import { CommonTransforms, CommonTypes } from '..';
import { EnglishWordsEntities } from '..';

export type EnglishWord = PartialKeys<Omit<EnglishWordsEntities.EnglishWordEntity, 'status' | 'timestamp' | 'tags'>, 'id'> & CommonTypes.Status;

/**
 * 获取单词数据
 * @param word 单词
 */
export async function getEnglishWord(word: string) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(EnglishWordsEntities.EnglishWordEntity);

  const result = await repository.findOne({ where: { word } });
  if (!result) return null;

  return CommonTransforms.dataToUserData(result);
}

/**
 * 获取指定状态的单词数据
 */
export async function getEnglishWordByStatus(status: CommonTypes.Status) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(EnglishWordsEntities.EnglishWordEntity);

  const result = await repository.findOne({ where: { status: CommonTransforms.userStatusToStatus(status) } });
  if (!result) return null;

  return CommonTransforms.dataToUserData(result);
}

/**
 * 获取所有指定状态的单词数据
 */
export async function getEnglishWordsByStatus(status: CommonTypes.Status) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(EnglishWordsEntities.EnglishWordEntity);

  const result = await repository.find({ where: { status: CommonTransforms.userStatusToStatus(status) } });
  if (!result) return null;

  return result.map(CommonTransforms.dataToUserData);
}

/**
 * 保存
 */
export async function saveEnglishWord(data: EnglishWord) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(EnglishWordsEntities.EnglishWordEntity);

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    const newData = CommonTransforms.userDataToData(data);

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
  const dataSource = await DataSource.initDataSource();

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
