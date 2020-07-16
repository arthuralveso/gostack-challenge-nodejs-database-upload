/* eslint-disable no-return-assign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public compareType(type: string): string | false {
    if (type === 'income' || type === 'outcome') {
      return type;
    }
    return false;
  }

  public async getBalance(transaction: Transaction[]): Promise<Balance> {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
    // alter
    await transaction.reduce((accumulator, object) => {
      if (object.type === 'income') {
        // eslint-disable-next-line no-param-reassign
        return (balance.income += object.value);
      }
      if (object.type === 'outcome') {
        return (balance.outcome += object.value);
      }
      return accumulator;
    }, 0);

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  // public invalidTransation(value: number, type: string): number | null {
  //   const balance = this.getBalance();

  //   if (value > balance.total && type === 'outcome') {
  //     return null;
  //   }
  //   return value;
  // }
}

export default TransactionsRepository;
