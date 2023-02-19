import { CurrencyCrypto } from 'src/exchange/enum/currency-from.enum';
import { CurrencyFiat } from 'src/exchange/enum/currency-to.enum';

export class CreatePriceDto {
    fiat: CurrencyFiat;
    crypto: CurrencyCrypto;
    amount: string;
}
