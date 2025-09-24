import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('tbl_roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'name', type: 'varchar', length: 50, unique: true })
  name: string;

  @OneToMany(() => Usuario, u => u.role)
  usuarios: Usuario[];
}
