import { CommonTransforms, CommonTypes } from '..';
import { TagsServices } from '..';
import { NpmPackagesEntities } from '..';
import { DataSource } from '..';

// 批量导入
export type NpmPackage = PartialKeys<Omit<NpmPackagesEntities.NpmPackageEntity, 'status' | 'timestamp' | 'tags'>, 'id'> &
  CommonTypes.Status & {
    tags?: TagsServices.Tag[];
  };

/**
 * 获取 npm 包
 * @param pkg 包名
 */
export async function getNpmPackage(pkg: string) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(NpmPackagesEntities.NpmPackageEntity);

  const result = await repository.findOne({ where: { pkg }, relations: ['tags'] });
  if (!result) return null;

  return CommonTransforms.dataToUserData(result);
}

/**
 * 获取指定状态的 npm 包
 */
export async function getNpmPackageByStatus(status: CommonTypes.Status) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(NpmPackagesEntities.NpmPackageEntity);

  const result = await repository.findOne({ where: { status: CommonTransforms.userStatusToStatus(status) }, relations: ['tags'] });
  if (!result) return null;

  return CommonTransforms.dataToUserData(result);
}

/**
 * 获取所有指定状态的 npm 包
 */
export async function getNpmPackagesByStatus(status: CommonTypes.Status) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(NpmPackagesEntities.NpmPackageEntity);

  const result = await repository.find({ where: { status: CommonTransforms.userStatusToStatus(status) }, relations: ['tags'] });
  if (!result) return null;

  return result.map(CommonTransforms.dataToUserData);
}

/**
 * 保存 npm 包
 */
export async function saveNpmPackage(data: NpmPackage) {
  const dataSource = await DataSource.initDataSource();
  const repository = dataSource.getRepository(NpmPackagesEntities.NpmPackageEntity);

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    const { tags, ...rest } = CommonTransforms.userDataToData(data);
    const newData = (tags ? { ...rest, tags: await TagsServices.saveTags(tags) } : rest) as NpmPackagesEntities.NpmPackageEntity;

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
  const dataSource = await DataSource.initDataSource();

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
