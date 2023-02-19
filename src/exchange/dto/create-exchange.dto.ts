import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CurrencyCrypto } from '../enum/currency-from.enum';
import { CurrencyFiat } from '../enum/currency-to.enum';

export class CreateExchangeDto {
    @ApiProperty({ enum: CurrencyCrypto })
    @IsNotEmpty()
    @IsEnum(CurrencyCrypto)
    currencyFrom: CurrencyCrypto;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amountFrom: number;

    @ApiProperty({ enum: CurrencyFiat })
    @IsNotEmpty()
    @IsEnum(CurrencyFiat)
    currencyTo: CurrencyFiat;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amountTo: number;
}
