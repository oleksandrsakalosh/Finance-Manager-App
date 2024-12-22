import React, { useState } from 'react';
import axios from "axios";
import './style.css';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                username, password
            });

            localStorage.setItem('token', response.data.token);
            window.location.href = "/dashboard";
        } catch (error) {
            setLoading(false);
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSignIn}>
                <h2>Sign In</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <button type="submit" className="signin-button" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
                <span>Don't have an account? <a href="/signup">Sign Up</a></span>
            </form>
        </div>
    );
};

export default SignIn;
