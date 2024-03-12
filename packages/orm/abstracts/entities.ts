import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class PublishedStatusAbstract {
  /**
   * 小红书发布状态
   */
  @Column({ default: false })
  xiaohongshu?: boolean;

  /**
   * 微信发布状态
   */
  @Column({ default: false })
  weixin?: boolean;

  /**
   * 掘金发布状态
   */
  @Column({ default: false })
  juejin?: boolean;

  /**
   * 知乎发布状态
   */
  @Column({ default: false })
  zhihu?: boolean;
}

export abstract class GeneratedStatusAbstract {
  /**
   * 数据生成状态
   */
  @Column({ default: false })
  data?: boolean;
}

export abstract class StatusAbstract {
  @Column(() => GeneratedStatusAbstract)
  generated: GeneratedStatusAbstract;

  @Column(() => PublishedStatusAbstract)
  published: PublishedStatusAbstract;
}

export class TimestampAbstract {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
