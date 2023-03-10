import { BadRequestException } from '@nestjs/common';

/**
 * Calculate pagination by pass page number
 * @param pageNumber
 * @returns Return [TAKE, SKIP]
 */
export async function paginationCalculator(
    pageNumber: number
): Promise<[number, number]> {
    const TAKE = 4;
    let SKIP = 0;

    if (pageNumber) {
        SKIP = (pageNumber - 1) * TAKE;
        if (SKIP < 0) throw new BadRequestException('invalid page number');
    }

    return [TAKE, SKIP];
}
