import { Result, failure, success } from '~/shared/core/result';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { TitleCreationError } from '~/shared/domain/errors';
import { AmountOfMoney, Title, Uuid } from '~/shared/domain/value-objects';
import { CashBookCreationError } from '../errors';
import {
  ReportingPeriod,
  ReportingPeriodPrimitives,
} from './reporting-period.entity';

export type CashBookPrimitives = {
  id: string;
  title: string;
  cashBalance: number;
  reportingPeriods: ReportingPeriodPrimitives[];
};

export type CreateCashBookParameters = Pick<CashBookPrimitives, 'title'> & {
  isTitleUnique: boolean;
};

export class CashBook extends AggregateRoot {
  private constructor(
    private readonly id: Uuid,
    private title: Title,
    private cashBalance: AmountOfMoney,
    private reportingPeriods: ReportingPeriod[] = [],
  ) {
    super();
  }

  static create(
    params: CreateCashBookParameters,
  ): Result<CashBookCreationError, CashBook> {
    const { title: titleValue, isTitleUnique } = params;

    const creatingError = new CashBookCreationError();

    const title: Result<TitleCreationError, Title> = Title.create({
      value: titleValue,
      isUnique: isTitleUnique,
    });

    if (title.isFailure()) {
      creatingError.errors.push(title.value);
    }

    const id = Uuid.create();
    const cashBalance = AmountOfMoney.create({ value: 0 });

    if (creatingError.errors.length > 0) {
      return failure(creatingError);
    }

    const cashBook = new CashBook(
      id.value as Uuid,
      title.value as Title,
      cashBalance.value as AmountOfMoney,
    );

    return success(cashBook);
  }

  static reconstitute(params: CashBookPrimitives): CashBook {
    const { id, title, cashBalance } = params;

    const reconstitutedId = Uuid.reconstitute({ value: id });
    const reconstitutedTitle = Title.reconstitute({ value: title });
    const reconstitutedCashBalance = AmountOfMoney.reconstitute({
      value: cashBalance,
    });

    const cashBook = new CashBook(
      reconstitutedId,
      reconstitutedTitle,
      reconstitutedCashBalance,
    );

    return cashBook;
  }

  mapToPrimitives(): CashBookPrimitives {
    const mappedCashBook = {
      id: this.id.getValue(),
      title: this.title.getValue(),
      cashBalance: this.cashBalance.getValue(),
      reportingPeriods: this.reportingPeriods.map((period: ReportingPeriod) =>
        period.mapToPrimitives(),
      ),
    };

    return mappedCashBook;
  }
}