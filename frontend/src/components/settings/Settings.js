import React, { useState, useEffect } from 'react';
import './style.css';
import axios from "axios";

const Settings = () => {
    const [formData, setFormData] = useState({});

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users', header);
                setFormData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserData();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [profileError, setProfileError] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put('http://localhost:8080/api/users', formData, header);
            setProfileError('');
        }
        catch (error) {
            console.error(error);
            setProfileError('Username is already taken. Please try again');
        }
    };

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
    };

    const [passwordError, setPasswordError] = useState('');

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        const user = {
            password: passwords.currentPassword,
            newPassword: passwords.newPassword
        };

        try{
            await axios.put('http://localhost:8080/api/users/password', user, header);
            setPasswordError('');
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
        catch (error) {
            console.error(error);
            setPasswordError('Invalid password. Please try again');
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try{
                await axios.delete('http://localhost:8080/api/users', header);
                localStorage.removeItem('token');
                window.location.href = '/';
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="profile-section">
                <h2>Profile</h2>
                <form onSubmit={handleProfileUpdate}>
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleProfileChange} required />
                    <label>Default Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleProfileChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                    {profileError && <div className="error-message">{profileError}</div>}
                    <button type="submit">Save</button>
                </form>
            </div>
            <div className="account-settings">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required />
                    <label>New Password</label>
                    <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />
                    <label>Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required />
                    {passwordError && <div className="error-message">{passwordError}</div>}
                    <button type="submit">Change Password</button>
                </form>
            </div>
            <button className="delete-account" onClick={handleDeleteAccount}><h3>Delete Account</h3></button>
        </div>
    );
};

export default Settings;
