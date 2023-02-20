import { ParentEntity } from '../../shared/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyCrypto } from '../enum/currency-from.enum';
import { CurrencyFiat } from '../enum/currency-to.enum';
import { ExchangeType } from '../enum/exchange-type.enum';

@Entity('exchange_history')
export class ExchangeHistoryEntity extends ParentEntity {
    constructor(obj?: Partial<ExchangeHistoryEntity>) {
        super();
        this.setArgumentToThisObject(obj);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'currency_from' })
    currencyFrom: CurrencyCrypto;

    @Column({ name: 'amount_from' })
    amountFrom: string;

    @Column({ name: 'currency_to' })
    currencyTo: CurrencyFiat;

    @Column({ name: 'amount_to' })
    amountTo: string;

    @Column()
    type: ExchangeType;
}
