import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CurrentFrom } from '../enum/currency-from.enum';
import { CurrentTo } from '../enum/currency-to.enum';

export class CreateExchangeDto {
    @ApiProperty({ enum: CurrentFrom })
    @IsNotEmpty()
    @IsEnum(CurrentFrom)
    currencyFrom: CurrentFrom;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amountFrom: number;

    @ApiProperty({ enum: CurrentTo })
    @IsNotEmpty()
    @IsEnum(CurrentTo)
    currencyTo: CurrentTo;
}
