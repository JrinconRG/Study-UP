import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Role } from './roles.entity';
import { Document } from './document.entity';
import { Comment } from './comments.entity';
import { Download } from './downloads.entity';
import { Favorite } from './favorite.entity';

@Entity('tbl_usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'firebase_uid', type: 'varchar', length: 128, unique: true })
  firebaseUid: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'full_name', type: 'varchar', length: 200, nullable: true })
  fullName: string | null;

  @Column({ name: 'profile_image_url', type: 'text', nullable: true })
  profileImageUrl: string | null;

  @Column({ name: 'role_id', nullable: true })
  roleId: number | null;

  @ManyToOne(() => Role, role => role.usuarios, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => Document, d => d.author)
  documents: Document[];

  @OneToMany(() => Comment, c => c.author)
  comments: Comment[];

  @OneToMany(() => Download, dl => dl.user)
  downloads: Download[];

  @OneToMany(() => Favorite, f => f.user)
  favorites: Favorite[];
}
