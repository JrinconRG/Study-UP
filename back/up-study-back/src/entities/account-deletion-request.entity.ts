import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('tbl_account_deletion_requests')
export class AccountDeletionRequest {
  @PrimaryGeneratedColumn({ name: 'request_id', type: 'bigint' })
  requestId: number;

  @Column({ name: 'user_id' , type: 'int'})
  userId: number;

  @ManyToOne(() => Usuario, u => u.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Usuario;

  @CreateDateColumn({ name: 'requested_at', type: 'timestamptz' })
  requestedAt: Date;

  @Column({ name: 'processed_by', type:'int', nullable: true })
  processedBy: number | null;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt: Date | null;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'pending' })
  status: string;
}
