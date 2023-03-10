import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { ExchangeHistoryEntity } from './entities/exchange-history.entity';
import { ExchangeType } from './enum/exchange-type.enum';
import { paginationCalculator } from '../shared/helper/pagination-calc.helper';
import { TotalSkipDto } from '../shared/dto/total-skip.dto';
import { GetExchangeDto } from './dto/get-exchange.dto';
import {
    FilterDateOn,
    TypeormDateFilter,
} from '../shared/sql/typeorm-date-filter.helper';

@Injectable()
export class ExchangeService {
    constructor(
        @InjectRepository(ExchangeHistoryEntity)
        private readonly exchangeHistoryRepository: Repository<ExchangeHistoryEntity>
    ) {}

    /**
     * Create a new exchange record
     * @param dto CreateExchangeDto
     * @param type ExchangeType
     * @returns Array of exchanges, ExchangeHistoryEntity[]
     */
    async create(
        dto: CreateExchangeDto,
        type?: ExchangeType
    ): Promise<ExchangeHistoryEntity> {
        return await this.exchangeHistoryRepository.save(
            new ExchangeHistoryEntity({
                ...dto,
                amountFrom: String(dto.amountFrom),
                amountTo: String(dto.amountTo),
                type: type ? type : ExchangeType.EXCHANGED,
            })
        );
    }

    /**
     * Get all exchange records
     * @param dto GetExchangeDto
     * @returns Return array, first index: exchanges | second index: Paginate data | [ExchangeHistoryEntity[], TotalSkipDto]
     */
    async getAll(
        dto: GetExchangeDto
    ): Promise<[ExchangeHistoryEntity[], TotalSkipDto]> {
        const paginationCal = await paginationCalculator(dto?.pageNumber);
        const TAKE = paginationCal[0];
        const SKIP = paginationCal[1];

        const filterDate = await TypeormDateFilter(
            'e',
            FilterDateOn.ON_CREATE,
            dto.fromDate,
            dto.toDate
        );

        const result = await this.exchangeHistoryRepository
            .createQueryBuilder('e')
            .take(TAKE)
            .skip(SKIP)
            .andWhere(filterDate)
            .andWhere(`e.type ${dto.type ? '= :type' : 'IS NOT NULL'}`, {
                type: dto.type,
            })
            .orderBy({ 'e.created_at': 'DESC' })
            .getManyAndCount();

        const meta: TotalSkipDto = {
            page: dto.pageNumber ? Number(dto.pageNumber) : 1,
            total: result[1],
        };

        return [result[0], meta];
    }
}
