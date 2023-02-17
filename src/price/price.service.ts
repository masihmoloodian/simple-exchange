import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PriceSocketDto } from 'src/socket/dto/price-socket.dto';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class PriceService {
    constructor(private socketGateway: SocketGateway) {}

    async getCurencyPrice() {
        var options = {
            method: 'GET',
            headers: {
                authorization: `Apikey ${process.env.CRYPTO_COMPARE_KEY}`,
            },
        };
        const res = await fetch(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD`
            // options
        );

        return res.json();
    }

    @Cron('* * * * * *')
    async sendPriceOnSocket() {
        const response = await this.getCurencyPrice();
        const fromCurreny = ['BTC', 'ETH'];
        const toCurreny = 'USD';

        console.log(response['RAW']);

        // response['RAW'][`${fromCurreny}`][`${toCurreny}`]['PRICE'];

        const multiCurrency: PriceSocketDto[] = [];

        for (const currency of fromCurreny) {
            let price = response['RAW'][`${currency}`][`${toCurreny}`]['PRICE'];

            multiCurrency.push({
                amount: price,
                fromCurrency: currency,
                toCurrency: toCurreny,
            });
        }

        this.socketGateway.sendPrice(multiCurrency);
    }
}
