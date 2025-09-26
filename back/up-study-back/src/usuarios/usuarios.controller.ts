import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/uptade-usuario.dto';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}


    @Get()
    findAll(){
        return this.usuariosService.findAll();
    }

    @Get(':id')
    findOneById(@Param('id') id: string){
        return this.usuariosService.findOneById(Number(id));
    }

    
    @Post('register')
    async register(@Body() dto: CreateUsuarioDto) {
        const created = await this.usuariosService.createWithFirebase(dto);
        return created;



    }
    @UseGuards(FirebaseAuthGuard)
    @Get('me') // mwtodo para buscar el usuario logueado
    async getOrFail(@Req() req: any) {
        const firebasePayload = req.user;
        const user = await this.usuariosService.findByFirebaseUid(firebasePayload.uid);
        if (!user) {
            throw new NotFoundException('User not registered. Please register first.');
        }
        return user;
        }


    

    @UseGuards(FirebaseAuthGuard)
    @Put(':id')
    update(@Param('id') id:string, @Body () dto: UpdateUsuarioDto){
        return this.usuariosService.update(Number(id), dto);}

    @UseGuards(FirebaseAuthGuard)
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.usuariosService.softDelete(Number(id));
    }}