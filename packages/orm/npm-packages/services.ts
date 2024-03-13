import { dataToStatus } from '../common/transform';
import { Status } from '../common/types';
import { saveTags, Tag } from '../tags/services';
import { initDataSource } from '../data-source';
import { NpmPackageEntity } from './entities';

// 批量导入
export type NpmPackage = PartialKeys<Omit<NpmPackageEntity, 'status' | 'timestamp' | 'tags'>, 'id'> &
  Status & {
    tags?: Tag[];
  };

/**
 * 保存 npm 包
 */
export async function saveNpmPackage(data: NpmPackage) {
  const dataSource = await initDataSource();
  const repository = dataSource.getRepository(NpmPackageEntity);

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    const { tags, ...rest } = dataToStatus(data);
    const newData = (tags ? { ...rest, tags: await saveTags(tags) } : rest) as NpmPackageEntity;

    let pkgEntity = await repository.findOne({ where: { pkg: data.pkg } });

    if (!pkgEntity) {
      pkgEntity = repository.create(newData);
    } else {
      pkgEntity = repository.merge(pkgEntity, newData);
    }

    await repository.save(pkgEntity);

    await queryRunner.commitTransaction();

    return pkgEntity;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error(`[NpmPackage: ${data.pkg}] -> 保存出错了（${error}）`);
  } finally {
    await queryRunner.release();
  }
}

/**
 * 批量保存 npm 包
 */
export const saveNpmPackages = async (data: NpmPackage[]) => {
  const total = data.length;
  const dataSource = await initDataSource();

  const errorResult = [];
  const successResult = [];

  for await (const item of data) {
    try {
      const pkgEntity = await saveNpmPackage(item);
      successResult.push(pkgEntity);
    } catch (error) {
      errorResult.push({ pkg: item.pkg, error });
    }
    console.log(`[NpmPackages: ${item.pkg}] -> 已处理 ${successResult.length + errorResult.length}/${total}`);
  }

  await dataSource.destroy();
  return [successResult, errorResult];
};
