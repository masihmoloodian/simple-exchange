import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeHistoryEntity } from './entities/exchange-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ExchangeHistoryEntity])],
    controllers: [ExchangeController],
    providers: [ExchangeService],
    exports: [ExchangeService],
})
export class ExchangeModule {}
