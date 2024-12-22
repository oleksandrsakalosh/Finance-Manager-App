package com.example.personalfinancemanager.dto;

public class BalanceHistoryDto {
    private String label;
    private double balance;

    public BalanceHistoryDto(String label, double balance) {
        this.label = label;
        this.balance = balance;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
