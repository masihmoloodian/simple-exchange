import { ParentEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CurrentFrom } from '../enum/currency-from.enum';
import { CurrentTo } from '../enum/currency-to.enum';
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
    currencyFrom: CurrentFrom;

    @Column({ name: 'amount_from' })
    amountFrom: string;

    @Column({ name: 'currency_to' })
    currencyTo: CurrentTo;

    @Column({ name: 'amount_to' })
    amountTo: string;

    @Column({ name: 'transaction_amount_to' })
    transactionAmountTo: string;

    @Column()
    type: ExchangeType;
}
