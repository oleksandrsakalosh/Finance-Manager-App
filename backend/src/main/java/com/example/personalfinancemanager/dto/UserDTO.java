package com.example.personalfinancemanager.dto;

public class UserDTO {

    private Integer userId;
    private String username;
    private String password;
    private String newPassword;
    private String currency;

    public UserDTO() {
    }

    public UserDTO(Integer userId, String username, String password, String newPassword, String currency) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.newPassword = newPassword;
        this.currency = currency;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
