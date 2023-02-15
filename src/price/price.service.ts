import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { CurrentFrom } from 'src/exchange/enum/currency-from.enum';
import { CurrentTo } from 'src/exchange/enum/currency-to.enum';
import { PriceSocketDto } from 'src/socket/dto/price-socket.dto';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class PriceService {
    constructor(
        private socketGateway: SocketGateway,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async getCurencyPrice(fromCurrency: CurrentFrom, toCurrency: CurrentTo) {
        var options = {
            method: 'GET',
            headers: {
                authorization: `Apikey ${process.env.CRYPTO_COMPARE_KEY}`,
            },
        };
        const res = await fetch(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromCurrency}&tsyms=${toCurrency}`,
            options
        );

        const temp = await res.json();

        return temp['RAW'][`${fromCurrency}`][`${toCurrency}`]['PRICE'];
    }

    async getCurencyPrices() {
        var options = {
            method: 'GET',
            headers: {
                authorization: `Apikey ${process.env.CRYPTO_COMPARE_KEY}`,
            },
        };
        const res = await fetch(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD,EUR`,
            options
        );

        return res.json();
    }

    @Cron('* * * * * *')
    async sendPriceOnSocket() {
        const cache = await this.cacheManager.get('price');
        if (cache) return cache;

        const response = await this.getCurencyPrices();
        const fromCurreny = ['BTC', 'ETH'];
        const toCurreny = 'USD';

        const multiCurrency: PriceSocketDto[] = [];

        for (const currency of fromCurreny) {
            let price = response['RAW'][`${currency}`][`${toCurreny}`]['PRICE'];

            multiCurrency.push({
                amount: price,
                currency,
                fiat: toCurreny,
            });
        }

        this.cacheManager.set('price', multiCurrency, 10 * 1000); // 10 Seconds

        this.socketGateway.sendPrice(multiCurrency);
    }
}
