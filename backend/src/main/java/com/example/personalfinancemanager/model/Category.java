package com.example.personalfinancemanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;


@Entity
public class Category {

    @Id
    @GeneratedValue
    private int categoryId;

    @NotNull
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name= "userId", nullable = false)
    private User user;

    @OneToMany(mappedBy = "category", orphanRemoval = true)
    private List<Transaction> transactions;

    public Category() {
    }

    public Category(int categoryId, @NotNull String name, User user, List<Transaction> transactions) {
        this.categoryId = categoryId;
        this.name = name;
        this.user = user;
        this.transactions = transactions;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
