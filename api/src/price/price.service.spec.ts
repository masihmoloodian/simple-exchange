import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import { ExchangeService } from '../exchange/exchange.service';
import { SocketGateway } from '../socket/socket.gateway';
import { ExchangeHistoryEntity } from '../exchange/entities/exchange-history.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('PriceService', () => {
    let service: PriceService;
    let cache: Cache;

    const mockExchangeHistory = {
        save: jest.fn().mockImplementation((ex) =>
            Promise.resolve({
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
                id: expect.any(String),
                ...ex,
            })
        ),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SocketGateway,
                PriceService,
                ExchangeService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: () => 'some value',
                        set: () => jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(ExchangeHistoryEntity),
                    useValue: mockExchangeHistory,
                },
            ],
        }).compile();

        service = module.get<PriceService>(PriceService);
        cache = module.get(CACHE_MANAGER);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all price with style', async () => {
        expect(await service.getAllLivePriceWithStyle()).toContainEqual({
            amount: expect.any(Number),
            crypto: expect.any(String),
            fiat: expect.any(String),
        });
    });
});
