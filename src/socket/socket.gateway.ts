import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { PriceSocketDto } from './dto/price-socket.dto';

@WebSocketGateway()
@Injectable()
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly socketService: SocketService) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketGateway');

    afterInit() {
        this.logger.log('Init socket');
    }
    handleConnection(client: Socket) {
        this.logger.log(`Socket Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Socket Client disconnected: ${client.id}`);
    }

    sendPrice(@MessageBody() body: any) {
        this.server.emit('price', body);
    }
}
