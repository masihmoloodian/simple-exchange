import { IsNumber, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional()
    @IsOptional()
    pageNumber?: number;
}
