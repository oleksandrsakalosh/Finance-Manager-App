import React, {useEffect, useState} from 'react';
import './style.css';
import { jwtDecode } from "jwt-decode";

const WelcomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsAuthenticated(true);
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        }
    }, []);

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome to Personal Finance Manager</h1>
                <p>Manage your finances effortlessly with our intuitive and powerful tools. Track your income and expenses, set financial goals, and stay on top of your budget with ease.</p>
                {!isAuthenticated && (
                    <div className="welcome-buttons">
                        <a href="/signup" className="welcome-button sign-up">Sign Up</a>
                        <a href="/signin" className="welcome-button sign-in">Sign In</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomePage;
