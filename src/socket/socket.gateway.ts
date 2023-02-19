import {
    WebSocketGateway,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
    CACHE_MANAGER,
    Injectable,
    Logger,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PriceService } from 'src/price/price.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,

        @Inject(forwardRef(() => PriceService))
        private readonly priceService: PriceService
    ) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketGateway');

    afterInit() {
        this.logger.log('Init socket');
    }

    async handleConnection(client: Socket) {
        this.logger.log(`Socket Client connected: ${client.id}`);

        // Send price to client when connected
        let price = await this.cacheManager.get('price');
        if (!price) price = await this.priceService.getAllLivePriceWithStyle();

        this.send('price', price);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Socket Client disconnected: ${client.id}`);
    }

    /**
     * Send payload on socket with given event name
     * @param event Socket event name
     * @param body any type
     */
    send(event: string, @MessageBody() body: any) {
        this.server.emit(event, body);
    }
}
