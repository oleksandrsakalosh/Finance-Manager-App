package com.example.personalfinancemanager.repository;

import com.example.personalfinancemanager.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :userId AND t.transactionDate <= :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsUpToDate(@Param("userId") int userId, @Param("endDate") LocalDate endDate);
}
