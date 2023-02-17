import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('RedAcre')
        .setDescription('The RedAcre API description')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/doc', app, document);

    await app.listen(3000);
}
bootstrap();
