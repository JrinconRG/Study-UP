import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';


@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private roleRepo: Repository<Role>){}


    findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: number) {
    const r = await this.roleRepo.findOne({ where: { roleId: id }});
    if (!r) throw new NotFoundException('Role not found');
    return r;
  }

  async findOneByName(name: string) {
    const r = await this.roleRepo.findOne({ where: { name }});
    if (!r) throw new NotFoundException('Role not found');
    return r;
  }



  create(dto: CreateRoleDto) {
    const r = this.roleRepo.create(dto as any);
    return this.roleRepo.save(r);
  }

  async remove(id: number) {
    const r = await this.findOne(id);
    return this.roleRepo.remove(r);
  }
}

