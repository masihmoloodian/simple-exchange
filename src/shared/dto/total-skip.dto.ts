import { ApiProperty } from '@nestjs/swagger';

export class TotalSkipDto {
    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;
}
