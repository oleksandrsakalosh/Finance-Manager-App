import React, {useEffect, useState} from "react";
import './style.css';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {DateRange} from 'react-date-range';
import SelectorBox from "./SelectorBox";
import {Pie} from "react-chartjs-2";
import axios from "axios";
import TransactionModal from "../modal/TransactionModal";

const IncomesExpenses = ({ onChange }) => {
    const [view, setView] = useState('Expenses');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);
    const [loading, setLoading] = useState(true);

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        const fetchData = () => {
            try {
                filterTransactions("", dateRange[0], 'Expenses');
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processCategoryData = (transactions) => {
        const categoryMap = new Map();
        transactions.forEach(transaction => {
            if (categoryMap.has(transaction.category.name)) {
                categoryMap.set(transaction.category.name, categoryMap.get(transaction.category.name) + transaction.amount);
            } else {
                categoryMap.set(transaction.category.name, transaction.amount);
            }
        });

        const labels = Array.from(categoryMap.keys());
        const data = Array.from(categoryMap.values());

        setCategoryData({
            labels: labels,
            datasets: [
                {
                    data: data,
                }
            ]
        });

        const categories = [];

        labels.forEach((label, index) => {
            categories.push({
                id: index,
                label: label,
                amount: data[index]
            });
        });

        setFilteredCategories(categories);
    };

    const handleRangeOnChange = (ranges) => {
        const { selection } = ranges;

        onChange(selection);
        setDateRange([selection]);
        setFilteredTransactions([]);

        filterTransactions(search, selection, view);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        filterTransactions(value, dateRange[0], view);
    };

    const handleViewChange = (selectedView) => {
        setView(selectedView);
        filterTransactions(search, dateRange[0], selectedView);
    };

    const filterTransactions = async (searchTerm, dateRange, selectedView) => {
        let filtered = await axios.get("http://localhost:8080/api/transactions", header)
            .catch(error => {
                console.log(error);
            });

        filtered = filtered.data;

        if (searchTerm) {
            filtered = filtered.filter(transaction =>
                transaction.category.name.toLowerCase().includes(searchTerm.toLowerCase())
                || transaction.amount.toString().includes(searchTerm)
            );
        }

        if (dateRange.startDate && dateRange.endDate) {
            filtered = filtered.filter(transaction => {
                const transactionDate = new Date(transaction.transactionDate);
                return transactionDate >= new Date(dateRange.startDate).setHours(0, 0, 0, 0)
                    && transactionDate <= new Date(dateRange.endDate).setHours(23, 59, 59, 999);
            });
        }

        if (selectedView) {
            const type = selectedView === 'Expenses' ? 'Expense' : 'Income';
            filtered = filtered.filter(transaction => transaction.type === type);
        }

        setFilteredTransactions(filtered);

        processCategoryData(filtered);
    };

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isEditingTransaction, setIsEditingTransaction] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState({});

    const handleOpenTransactionModal = (e) => {
        e.preventDefault();
        setIsTransactionModalOpen(true);
    };

    const handleCloseTransactionModal = () => {
        setIsTransactionModalOpen(false);
        if(isEditingTransaction) {
            setIsEditingTransaction(false);
            setCurrentTransaction({});
        }
    };

    const handleSubmitTransaction = () => {
        handleCloseTransactionModal();
    };

    const handleEditTransaction = (transaction) => {
        setIsEditingTransaction(true);
        setCurrentTransaction(transaction);
        setIsTransactionModalOpen(true);
    }

    const handleDeleteTransaction = (transaction) => {
        axios.delete('http://localhost:8080/api/transactions/' + transaction.transactionId, header)
            .catch(error => {
                console.log(error);
            });
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="inc-exp-container">
            <div className="left-container">
                <div className="filter-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="select-box">
                    <SelectorBox onSelect={handleViewChange} />
                </div>
                <div className="calendar-container">
                    <DateRange
                        onChange={handleRangeOnChange}
                        showSelectionPreview={true}
                        value={dateRange}
                        ranges={dateRange}
                        direction="horizontal"
                    />
                </div>
            </div>
            <div className="right-container">
                <div className="category-container">
                    <h2>Category Spending</h2>
                    {filteredTransactions.length === 0 ? (
                        <p>No information</p>
                    ) : (
                        <div className="category-container-2">
                            <div className="chart">
                                <Pie
                                    data={categoryData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (tooltipItem) {
                                                        return `${tooltipItem.label}: $${tooltipItem.raw}`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="category-list">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredCategories.map(category => (
                                        <tr key={category.id}>
                                            <td>{category.label}</td>
                                            <td>{category.amount}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                <div className="transaction-list">
                    <h2>Transaction List</h2>
                    {filteredTransactions.length === 0 ? (
                        <p>No information</p>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th></th>
                                <th><a href="/" className="add-transaction-button" onClick={handleOpenTransactionModal} >+</a></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTransactions.map(transaction => (
                                <tr key={transaction.transactionId}>
                                    <td>{transaction.transactionDate}</td>
                                    <td className={transaction.type === 'Income' ? 'positive' : 'negative'}>
                                        ${transaction.amount}
                                    </td>
                                    <td>{transaction.category.name}</td>
                                    <td>
                                        <button onClick={() => handleEditTransaction(transaction)} className="edit-transaction-button">Edit</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteTransaction(transaction)} className="delete-transaction-button">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={handleCloseTransactionModal}
                onSubmit={handleSubmitTransaction}
                isEditing={isEditingTransaction}
                transaction={currentTransaction}
            />
        </div>
    );
};

export default IncomesExpenses;