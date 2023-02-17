import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

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
