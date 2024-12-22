import React, { useState } from 'react';
import axios from "axios";
import './style.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/users/register', {
                username, password
            }).catch((error) => {
                setError('Username is already taken. Please try again.');
                setLoading(false);
                console.error(error);
            });

            localStorage.setItem('token', response.data.token);
            window.location.href = "/dashboard";
        } catch (error) {}
    };

    return (
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
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
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
                <span>Already have an account? <a href="/signin">Sign In</a></span>
            </form>
        </div>
    );
};

export default SignUp;
