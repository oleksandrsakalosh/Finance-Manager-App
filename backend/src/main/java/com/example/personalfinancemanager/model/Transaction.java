package com.example.personalfinancemanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
public class Transaction {

    @Id
    @GeneratedValue
    private int transactionId;

    @NotNull
    private String type;

    @NotNull
    private double amount;

    private String description;

    @NotNull
    private LocalDate transactionDate;

    private String interval;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name= "categoryId")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name= "userId", nullable = false)
    private User user;

    public Transaction() {
    }

    public Transaction(int transactionId, @NotNull String type, @NotNull double amount,
                       String description, @NotNull LocalDate transactionDate,
                       String interval, User user, Category category) {
        this.transactionId = transactionId;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate;
        this.interval = interval;
        this.user = user;
        this.category = category;
    }

    public int getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(int transactionId) {
        this.transactionId = transactionId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
