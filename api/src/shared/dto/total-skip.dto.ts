import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TotalSkipDto {
    @ApiProperty()
    @IsNumber()
    total: number;

    @ApiProperty()
    @IsNumber()
    page: number;
}
