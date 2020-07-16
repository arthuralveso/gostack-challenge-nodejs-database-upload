import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    category,
    value,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const newCategory = await categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(newCategory);
      const transaction = await transactionRepository.create({
        title,
        type,
        category_id: newCategory.id,
        value,
      });
      await transactionRepository.save(transaction);

      return transaction;
    }
    const transaction = await transactionRepository.create({
      title,
      type,
      category_id: checkCategoryExists.id,
      value,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
