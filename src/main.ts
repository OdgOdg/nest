import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('NestJS Swagger 예제 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 추가 (필요 시)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Swagger URL: http://localhost:8000/api-docs

  await app.listen(8000);
}
bootstrap();
