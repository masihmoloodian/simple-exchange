import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { ListResponseDTO } from 'src/shared/dto/response.dto';
import { response } from 'express';
import { GetExchangeDto } from './dto/get-exchange.dto';
@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeService: ExchangeService) {}

    @Post()
    async create(@Body() dto: CreateExchangeDto) {
        return this.exchangeService.create(dto);
    }

    @Get()
    async getAll(@Query() dto: GetExchangeDto) {
        const response = await this.exchangeService.getAll(dto);
        return new ListResponseDTO(response[0], response[1]);
    }
}
