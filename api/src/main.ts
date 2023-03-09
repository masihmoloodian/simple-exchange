import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allow =
        process.env.NODE_ENV === 'production'
            ? [process.env.ALLOWED_ORIGIN_DOMAIN_NAME]
            : ['http://localhost:3001'];
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'UPDATE', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type', 'Set-Cookie'],
    });

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Exchange')
        .setDescription('The Exchange API description')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/doc', app, document);

    await app.listen(3000);
}
bootstrap();
