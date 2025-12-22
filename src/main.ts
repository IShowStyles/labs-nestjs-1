import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    // origin: process.env.FRONTEND_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Sensor API')
    .setVersion('1.0')
    .addTag('sensors')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3033;
  const server = await app.listen(PORT);
  server.setTimeout(0);
  server.keepAliveTimeout = 0;
}
bootstrap();
