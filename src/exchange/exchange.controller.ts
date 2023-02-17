import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { ListResponseDTO, ResponseDTO } from 'src/shared/dto/response.dto';
import { GetExchangeDto } from './dto/get-exchange.dto';
@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeService: ExchangeService) {}

    @Post()
    async create(@Body() dto: CreateExchangeDto) {
        return new ResponseDTO(await this.exchangeService.create(dto));
    }

    @Get()
    async getAll(@Query() dto: GetExchangeDto) {
        const response = await this.exchangeService.getAll(dto);
        return new ListResponseDTO(response[0], response[1]);
    }
}
