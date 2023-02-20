import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ExchangeModule } from '../src/exchange/exchange.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeHistoryEntity } from '../src/exchange/entities/exchange-history.entity';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    const mockExchangeHistory = [
        {
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            id: expect.any(String),
            currencyFrom: expect.any(String),
            amountFrom: expect.any(String),
            currencyTo: expect.any(String),
            amountTo: expect.any(String),
            type: expect.any(String),
        },
    ];

    const mockExchangeRepository = {
        createQueryBuilder: jest.fn(() => ({
            take: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockReturnThis(),
        })),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ExchangeModule],
        })
            .overrideProvider(getRepositoryToken(ExchangeHistoryEntity))
            .useValue(mockExchangeRepository)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/exchange (GET)', () => {
        return request(app.getHttpServer()).get('/exchange').expect(200);
    });
});
