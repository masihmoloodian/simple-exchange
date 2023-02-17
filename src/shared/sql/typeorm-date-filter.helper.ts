import { Brackets } from 'typeorm';

export enum FilterDateOn {
    ON_CREATE = 'created_at',
    ON_UPDATE = 'updated_at',
}

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
            ? (start = new Date(new Date(startDate).setHours(0, 0, 0, 0)))
            : (start = new Date('1970'));
        endDate
            ? (end = new Date(new Date(endDate).setHours(23, 59, 59, 999)))
            : (end = new Date('2200'));

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
        filterDate = new Brackets((qb) => {
            qb.where('1 =:num', {
                num: 1,
            });
        });
    }
    return filterDate;
}
