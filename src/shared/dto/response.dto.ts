import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TotalSkipDto } from './total-skip.dto';

export class ResponseDTO {
    constructor(data: any, message: string = 'Success', code: number = 200) {
        this.data = data;
        this.message = message;
        this.code = code;
    }

    @ApiProperty()
    @IsNotEmpty()
    data: any;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    code: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    message: string;
}

export class ListResponseDTO {
    constructor(
        data: any,
        metadata: TotalSkipDto = { total: null, page: null },
        message: string = 'Success',
        code: number = 200
    ) {
        this.data = data;
        this.metadata = metadata;
        this.message = message;
        this.code = code;
    }

    @ApiProperty()
    @IsNotEmpty()
    data: any;

    @ApiPropertyOptional()
    @IsOptional()
    metadata: TotalSkipDto;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    code: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    message: string;
}
