import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tbl_moderation_logs')
export class ModerationLog {
  @PrimaryGeneratedColumn({ name: 'log_id', type: 'bigint' })
  logId: number;

  @Column({ name: 'actor_user_id', nullable: true, type: 'int' })
  actorUserId: number | null;

  @Column({ name: 'target_table', type: 'varchar', length: 100, nullable: true })
  targetTable: string | null;

  @Column({ name: 'target_id', type: 'bigint', nullable: true })
  targetId: number | null;

  @Column({ name: 'action', type: 'varchar', length: 50 })
  action: string;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
