import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

// Importamos Firebase y el controlador de perfil
import { FirebaseModule } from '../up-study-back/src/auth/firebase/firebase.module';
import { ProfileController } from '../up-study-back/src/auth/profile/profile.controller';


// Agregar AppController/AppService y UsuariosModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from '../up-study-back/src/usuarios/usuarios.module'; // <-- ajusta si está en otra ruta

@Module({
  imports: [
    // Configuración de TypeORM con Postgres
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres', // "postgres" si usas docker-compose
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: false, // obligatorio si tablas ya existen

      logging: process.env.TYPEORM_LOGGING === 'true',
    }),

    // Firebase 
    FirebaseModule,
    UsuariosModule,
  ],
  controllers: [ProfileController, AppController],
  providers: [AppService],
})
export class AppModule {}
