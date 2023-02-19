import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { ExchangeType } from '../enum/exchange-type.enum';

export class GetExchangeDto extends PaginationDto {
    @ApiPropertyOptional({ example: new Date() })
    fromDate?: Date;

    @ApiPropertyOptional({ example: new Date() })
    toDate?: Date;

    @ApiPropertyOptional({ enum: ExchangeType })
    type?: ExchangeType;
}
