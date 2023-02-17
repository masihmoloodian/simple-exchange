import { Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';

@Injectable()
export class PriceService {
    async getCurencyPrice() {
        var options = {
            method: 'GET',
            headers: {
                authorization: `Apikey ${process.env.CRYPTO_COMPARE_KEY}`,
            },
        };
        const res = await fetch(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD`,
            options
        );

        return res;
    }
}
