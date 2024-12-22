package com.example.personalfinancemanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "limits")
public class Limit {

    @Id
    @GeneratedValue
    private int limitId;

    @NotNull
    private double amount;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "userId")
    private User user;

    @OneToOne
    @JoinColumn(name = "categoryId")
    private Category category;


    public Limit() {
    }

    public Limit(int limitId, @NotNull double amount, User user, Category category) {
        this.limitId = limitId;
        this.amount = amount;
        this.user = user;
        this.category = category;
    }

    public int getLimitId() {
        return limitId;
    }

    public void setLimitId(int limitId) {
        this.limitId = limitId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
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
