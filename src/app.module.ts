import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'redacre',
            password: 'redacre',
            database: 'redacre',
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
            ssl: false,
        }),
        ExchangeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
