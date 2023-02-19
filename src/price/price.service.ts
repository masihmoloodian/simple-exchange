import { Inject, Injectable, CACHE_MANAGER, forwardRef } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { CurrencyCrypto } from '../exchange/enum/currency-from.enum';
import { CurrencyFiat } from '../exchange/enum/currency-to.enum';
import { ExchangeType } from '../exchange/enum/exchange-type.enum';
import { ExchangeService } from '../exchange/exchange.service';
import { PriceSocketDto } from '../socket/dto/price-socket.dto';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class PriceService {
    constructor(
        private readonly exchangeService: ExchangeService,

        @Inject(forwardRef(() => SocketGateway))
        private readonly socketGateway: SocketGateway,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    private fetchOptions = {
        method: 'GET',
        headers: {
            authorization: `Apikey ${process.env.CRYPTO_COMPARE_KEY}`,
        },
    };

    /**
     * Get live price of pair currency
     * @param crypto eg. BTC
     * @param fiat eg. USD
     * @returns Price of pair currency
     */
    async getCurencyPrice(crypto: CurrencyCrypto, fiat: CurrencyFiat) {
        const res = await fetch(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${fiat}`,
            this.fetchOptions
        );

        const temp = await res.json();
        return temp['RAW'][`${crypto}`][`${fiat}`]['PRICE'];
    }

    /**
     * Get all price of pair currency with specific style
     * @returns Array {crypto, fiat, amount}
     */
    async getAllLivePriceWithStyle(): Promise<PriceSocketDto[]> {
        const multiCurrency: PriceSocketDto[] = [];
        const cryptoList = ['BTC', 'ETH'];
        const fiatList = ['USD', 'EUR'];
        const response = await this.getCurencyPrices();

        for (const crypto of cryptoList as any) {
            for (const fiat of fiatList as any) {
                let price = response['RAW'][`${crypto}`][`${fiat}`]['PRICE'];
                await this.exchangeService.create(
                    {
                        currencyFrom: crypto,
                        amountFrom: 1,
                        currencyTo: fiat,
                        amountTo: price,
                    },
                    ExchangeType.LIVE_PRICE
                );
                multiCurrency.push({
                    amount: price,
                    crypto,
                    fiat,
                });
            }
        }

        return multiCurrency;
    }

    /**
     * Get all currency prices
     * @returns All currency prices
     */
    private async getCurencyPrices() {
        const res = await fetch(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD,EUR`,
            this.fetchOptions
        );
        return res.json();
    }

    @Cron('1 * * * * *')
    /**
     * Update Price eveny N minute and send on socket
     */
    async sendPriceOnSocket() {
        console.log('>>>Cron<<<');

        const price = await this.getAllLivePriceWithStyle();

        // Store price in memory to use at socket init connection (prevent DB request)
        this.cacheManager.set('price', price);

        this.socketGateway.send('price', price);
    }
}
