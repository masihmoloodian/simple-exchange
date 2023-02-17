import { CacheModule, Module } from '@nestjs/common';
import { SocketModule } from 'src/socket/socket.module';
import { PriceService } from './price.service';

@Module({
    imports: [SocketModule, CacheModule.register()],
    providers: [PriceService],
    exports: [PriceService],
})
export class PriceModule {}
