import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Activar CORS
  app.enableCors({
    origin: '*', // dominio de tu frontend Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,               // si envías cookies o headers de auth
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();