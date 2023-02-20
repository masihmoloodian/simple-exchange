import { Brackets } from 'typeorm';

export enum FilterDateOn {
    ON_CREATE = 'created_at',
    ON_UPDATE = 'updated_at',
}

/**
 * Create Date filter querty for typeorm, (pass to where), if null value is provided all records returned
 * @param filterOn created_at, updated_at
 * @param startDate Date
 * @param endDate Date
 * @returns Filter query for where clause
 */

export function TypeormDateFilter(
    alias: string,
    filterOn: FilterDateOn,
    startDate: Date,
    endDate: Date
) {
    let filterDate: any;
    if (startDate || endDate) {
        let start = new Date();
        let end = new Date();

        startDate
            ? (start = new Date(new Date(startDate).setHours(0, 0, 0, 0))) // Set start Date at the beginning of the date
            : (start = new Date('1970')); // epoch time
        endDate
            ? (end = new Date(new Date(endDate).setHours(23, 59, 59, 999))) // Set end Date at the endding of the date
            : (end = new Date('2200')); // Far date

        filterDate = new Brackets((qb) => {
            qb.where(
                `${alias}.${filterOn} >= :start AND ${alias}.${filterOn} <= :end`,
                {
                    start,
                    end,
                }
            );
        });
    } else {
        // Return all data
        filterDate = new Brackets((qb) => {
            qb.where('1 =:all', {
                all: 1,
            });
        });
    }
    return filterDate;
}
