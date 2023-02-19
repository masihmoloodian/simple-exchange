import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeHistoryEntity } from './entities/exchange-history.entity';
import { CurrencyCrypto } from './enum/currency-from.enum';
import { CurrencyFiat } from './enum/currency-to.enum';
import { ExchangeType } from './enum/exchange-type.enum';
import { ExchangeService } from './exchange.service';

describe('ExchangeService', () => {
    let service: ExchangeService;

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
                ExchangeService,
                {
                    provide: getRepositoryToken(ExchangeHistoryEntity),
                    useValue: mockExchangeHistory,
                },
            ],
        }).compile();

        service = module.get<ExchangeService>(ExchangeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be create a exchange record and return it', async () => {
        expect(
            await service.create({
                currencyFrom: CurrencyCrypto.BTC,
                amountFrom: 1,
                currencyTo: CurrencyFiat.USD,
                amountTo: 25000,
            })
        ).toEqual({
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            id: expect.any(String),
            currencyFrom: CurrencyCrypto.BTC,
            amountFrom: '1',
            currencyTo: CurrencyFiat.USD,
            amountTo: '25000',
            type: ExchangeType.EXCHANGED,
        });
    });
});
