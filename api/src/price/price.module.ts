import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeModule } from '../exchange/exchange.module';
import { SocketModule } from '../socket/socket.module';
import { PriceService } from './price.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(),
        SocketModule,
        // CacheModule.register(),
        forwardRef(() => ExchangeModule),
    ],
    providers: [PriceService],
    exports: [PriceService],
})
export class PriceModule {}
