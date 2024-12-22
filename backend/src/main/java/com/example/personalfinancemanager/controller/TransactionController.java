package com.example.personalfinancemanager.controller;

import com.example.personalfinancemanager.dto.BalanceHistoryDto;
import com.example.personalfinancemanager.model.Transaction;
import com.example.personalfinancemanager.model.User;
import com.example.personalfinancemanager.repository.TransactionRepository;
import com.example.personalfinancemanager.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TransactionController {

    private TransactionRepository transactionRepository;
    private TransactionService transactionService;

    public TransactionController(TransactionRepository transactionRepository, TransactionService transactionService) {
        this.transactionRepository = transactionRepository;
        this.transactionService = transactionService;
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getUserTransactions(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Transaction> transactions = transactionService.getTransactionsUpToDate(userId, LocalDate.now());
        transactions.sort((t1, t2) -> t2.getTransactionDate().compareTo(t1.getTransactionDate()));
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/week-transactions")
    public ResponseEntity<List<Transaction>> getTransactionsForLastWeek(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        List<Transaction> transactions = transactionService.getTransactionsFromInterval(startDate, endDate, userId);
        transactions.sort((t1, t2) -> t2.getTransactionDate().compareTo(t1.getTransactionDate()));
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/month-transactions")
    public ResponseEntity<List<Transaction>> getTransactionsForLastMonth(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        LocalDate startDate = LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = LocalDate.now();
        List<Transaction> transactions = transactionService.getTransactionsFromInterval(startDate, endDate, userId);
        transactions.sort((t1, t2) -> t2.getTransactionDate().compareTo(t1.getTransactionDate()));
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/balance-history")
    public ResponseEntity<List<BalanceHistoryDto>> getBalanceHistory(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(transactionService.getBalanceHistory(userId));
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction,
                                                         HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUserId(userId);
        transaction.setUser(user);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    @PutMapping("/transactions/{transactionId}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable int transactionId,
                                                         @RequestBody Transaction transaction,
                                                         HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Transaction existingTransaction = transactionRepository.findById(transactionId).orElse(null);
        if (existingTransaction != null && existingTransaction.getUser().getUserId() == userId) {
            existingTransaction.setAmount(transaction.getAmount());
            existingTransaction.setCategory(transaction.getCategory());
            existingTransaction.setTransactionDate(transaction.getTransactionDate());
            existingTransaction.setType(transaction.getType());
            existingTransaction.setInterval(transaction.getInterval());
            Transaction savedTransaction = transactionRepository.save(existingTransaction);
            return ResponseEntity.ok(savedTransaction);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/transactions/{transactionId}")
    public void deleteTransaction(@PathVariable int transactionId, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);

        if (transaction != null && transaction.getUser().getUserId() == userId) {
            transactionRepository.deleteById(transactionId);
        }
    }
}
