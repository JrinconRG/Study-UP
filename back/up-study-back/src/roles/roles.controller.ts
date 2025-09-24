import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('roles')
export class RolesController{
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    findAll(){
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOneById(@Param('id') id: string){
        return this.rolesService.findOne(Number(id));
    }

    @UseGuards(FirebaseAuthGuard)
    @Post()
    create(@Body () dto: CreateRoleDto){
        return this.rolesService.create(dto);
    }
    @UseGuards(FirebaseAuthGuard)
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.rolesService.remove(Number(id));
    }
    
}