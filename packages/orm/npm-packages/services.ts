import { initDataSource } from '../data-source';
import { saveTags } from '../tags/services';
import { NpmPackageEntity } from './entities';
import { NpmPackage } from './types';

/**
 * 保存 npm 包
 */
export async function saveNpmPackage(data: NpmPackage) {
  const dataSource = await initDataSource();
  const repository = dataSource.getRepository(NpmPackageEntity);

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    const { tags, ...rest } = data;
    const newData = (tags ? { ...rest, tags: await saveTags(data.tags) } : rest) as NpmPackageEntity;

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
    console.error(`[Package: ${data.pkg}] -> 保存出错了（${error.message}）`);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}

/**
 * 批量保存 npm 包
 */
export const saveNpmPackages = async (data: NpmPackage[]) => {
  const dataSource = await initDataSource();

  const errorResult = [];
  const successResult = [];

  for await (const item of data) {
    try {
      const pkgEntity = await saveNpmPackage(item);
      successResult.push(pkgEntity);
    } catch (error) {
      errorResult.push({ pkg: item.pkg, error: error.message });
    }
  }

  await dataSource.destroy();
  return [successResult, errorResult];
};
