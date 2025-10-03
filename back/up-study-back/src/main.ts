import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configurar swagger
  const config = new DocumentBuilder()
    .setTitle('Study UP API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Activar CORS
  app.enableCors({
    origin: '*', // dominio de tu frontend Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,               // si envías cookies o headers de auth
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Firebase-Token'],

  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();