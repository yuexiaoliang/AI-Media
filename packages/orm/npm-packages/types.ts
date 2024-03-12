import { NpmPackageEntity } from './entities';
import { Status } from '../abstracts/types';
import { Tag } from '../tags/types';

// 批量导入
export type NpmPackage = PartialKeys<Omit<NpmPackageEntity, 'status' | 'timestamp' | 'tags'>, 'id'> &
  Status & {
    tags?: Tag[];
  };
