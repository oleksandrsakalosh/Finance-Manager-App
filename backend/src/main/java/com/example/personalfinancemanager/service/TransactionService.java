package com.example.personalfinancemanager.service;

import com.example.personalfinancemanager.dto.BalanceHistoryDto;
import com.example.personalfinancemanager.model.Transaction;
import com.example.personalfinancemanager.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsUpToDate(int userId, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findTransactionsUpToDate(userId, endDate);

        List<Transaction> allTransactions = new ArrayList<>();

        for (Transaction transaction : transactions) {
            if (transaction.getInterval() != null) {
                LocalDate recurringDate = transaction.getTransactionDate();
                while (recurringDate.isBefore(endDate) || recurringDate.isEqual(endDate)) {
                    Transaction recurringTransaction = new Transaction();
                    recurringTransaction.setAmount(transaction.getAmount());
                    recurringTransaction.setCategory(transaction.getCategory());
                    recurringTransaction.setInterval(transaction.getInterval());
                    recurringTransaction.setTransactionDate(recurringDate);
                    recurringTransaction.setType(transaction.getType());
                    allTransactions.add(recurringTransaction);
                    recurringDate = getNextRecurringDate(recurringDate, transaction.getInterval());
                }
            } else {
                allTransactions.add(transaction);
            }
        }

        return allTransactions;
    }

    public List<Transaction> getTransactionsFromInterval(LocalDate startDate, LocalDate endDate, int userId) {
        List<Transaction> transactions = getTransactionsUpToDate(userId, endDate);
        List<Transaction> allTransactions = new ArrayList<>();

        for (Transaction transaction : transactions) {
            if (transaction.getTransactionDate().isAfter(startDate) || transaction.getTransactionDate().isEqual(startDate)) {
                allTransactions.add(transaction);
            }
        }

        return allTransactions;
    }

    public List<BalanceHistoryDto> getBalanceHistory(int userId) {
        LocalDate today = LocalDate.now();

        List<Transaction> allTransactions = getTransactionsUpToDate(userId, today);

        double currentBalance = 0;
        for (Transaction transaction : allTransactions) {
            boolean isExpense = transaction.getType().equals("Expense");
            currentBalance += isExpense ? -transaction.getAmount() : transaction.getAmount();
        }

        List<BalanceHistoryDto> balanceHistory = new ArrayList<>();
        double dailyBalance = currentBalance;

        balanceHistory.add(0, new BalanceHistoryDto(
                today.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH), dailyBalance));

        for (int i = 0; i < 6; i++) {
            LocalDate date = today.minusDays(i);
            String dayLabel = date.minusDays(1)
                    .getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

            for (Transaction transaction : allTransactions) {
                if (transaction.getTransactionDate().isEqual(date)) {
                    boolean isExpense = transaction.getType().equals("Expense");
                    dailyBalance += isExpense ? transaction.getAmount() : -transaction.getAmount();
                }
            }
            balanceHistory.add(0, new BalanceHistoryDto(dayLabel, dailyBalance));
        }

        return balanceHistory;
    }

    private LocalDate getNextRecurringDate(LocalDate startDate, String interval) {
        switch (interval.toLowerCase()) {
            case "daily":
                return startDate.plusDays(1);
            case "weekly":
                return startDate.plusWeeks(1);
            case "monthly":
                return startDate.plusMonths(1);
            case "yearly":
                return startDate.plusYears(1);
            default:
                throw new IllegalArgumentException("Unknown interval: " + interval);
        }
    }
}