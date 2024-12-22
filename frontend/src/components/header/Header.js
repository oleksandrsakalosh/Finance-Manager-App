import React, {useEffect, useState} from 'react';
import { jwtDecode } from "jwt-decode";
import './style.css';
import logo from '../../images/Logo.png';
import TransactionModal from '../modal/TransactionModal';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = () => {
        handleCloseModal();
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "/";
        setIsAuthenticated(false);
    }

    return (
        <header className="header">
            <div className="header-logo">
                <a href="/"><img src={logo} alt="Logo" /></a>
            </div>
            {isAuthenticated && (
                <div className="header-menu">
                    <nav className="header-nav">
                        <a href="/dashboard" className="nav-link">Dashboard</a>
                        <a href="/incomes-expenses" className="nav-link">Incomes and Expenses</a>
                        <a href="/goals-limits" className="nav-link">Goals and Limits</a>
                        <a href="/settings" className="nav-link">Settings</a>
                    </nav>
                    <div className="header-right">
                        <a href="/" className="add-transaction-button" onClick={handleOpenModal} >New Transaction</a>
                        <a href="/" className="logout-button" onClick={handleLogout}>Logout</a>
                    </div>
                    <TransactionModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmit}
                    />
                </div>
            )}
        </header>
    );
};

export default Header;