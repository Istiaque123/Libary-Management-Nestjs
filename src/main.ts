import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const uploadDir = join(__dirname, '..', 'Uploads');
  console.log('Serving static files from:', uploadDir); // Debug path
  app.useStaticAssets(uploadDir, { prefix: '/Uploads/' });
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
