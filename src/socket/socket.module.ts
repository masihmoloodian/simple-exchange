import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { PriceModule } from '../price/price.module';
import { SocketGateway } from './socket.gateway';

@Module({
    imports: [CacheModule.register(), forwardRef(() => PriceModule)],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
