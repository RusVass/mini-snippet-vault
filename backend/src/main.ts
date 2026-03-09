import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const getAllowedOrigins = (): string[] => {
  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
  ];

  const rawOrigins = process.env.CORS_ORIGINS;

  if (!rawOrigins) {
    return defaultOrigins;
  }

  const customOrigins = rawOrigins
    .split(',')
    .map((origin) => {
      return origin.trim();
    })
    .filter(Boolean);

  if (customOrigins.length === 0) {
    return defaultOrigins;
  }

  return customOrigins;
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getAllowedOrigins(),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 3001);
};

void bootstrap();
