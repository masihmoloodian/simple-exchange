import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyCrypto } from './enum/currency-from.enum';
import { CurrencyFiat } from './enum/currency-to.enum';
import { ExchangeType } from './enum/exchange-type.enum';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

describe('ExchangeController', () => {
    let controller: ExchangeController;

    const mockExchangeService = {
        create: jest.fn((dto) => {
            return {
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
                id: expect.any(String),
                ...dto,
            };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExchangeController],
            providers: [ExchangeService],
        })
            .overrideProvider(ExchangeService)
            .useValue(mockExchangeService)
            .compile();

        controller = module.get<ExchangeController>(ExchangeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a exchange', async () => {
        const res = await controller.create({
            currencyFrom: CurrencyCrypto.BTC,
            amountFrom: 1,
            currencyTo: CurrencyFiat.USD,
            amountTo: 25000,
        });

        expect(res.data).toEqual({
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            id: expect.any(String),
            currencyFrom: CurrencyCrypto.BTC,
            amountFrom: 1,
            currencyTo: CurrencyFiat.USD,
            amountTo: 25000,
        });
    });
});
