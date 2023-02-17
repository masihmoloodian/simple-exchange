import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CurrentFrom } from '../enum/currency-from.enum';
import { CurrentTo } from '../enum/currency-to.enum';

export class CreateExchangeDto {
    @ApiProperty({ enum: CurrentFrom })
    @IsNotEmpty()
    currencyFrom: CurrentFrom;

    @ApiProperty()
    @IsNotEmpty()
    amountFrom: string;

    @ApiProperty({ enum: CurrentTo })
    @IsNotEmpty()
    currencyTo: CurrentTo;
}
